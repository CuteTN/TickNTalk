import React, { useEffect, useState, useRef, useMemo } from "react";
import { Layout, Button, Divider } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import { ImageBackground, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Composer,
  MessageImage,
  FlatList,
} from "react-native-gifted-chat";
import { Video, Audio } from "expo-av";
import { MessageCard } from "../components/MessageCard";
import CameraPreview from "../components/CameraPreview";
import VideoPreview from "../components/VideoPreview";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import { CustomizedCamera } from "../components/CustomizedCamera";
import { sizeFactor, windowWidth } from "../styles/Styles";
import {
  pickProcess,
  uploadPhotoAndGetLink,
  uploadAudiotoFirebase,
  getVoice,
  getPermissions,
} from "../Utils/uploadPhotoVideo";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import { SCREENS } from ".";
import { BackAction } from "../components/TopNavigationBar";
import { SafeView, Styles } from "../styles/Styles";
import * as Icon from "../components/Icon";
import * as Permissions from "expo-permissions";
import { sendPushNotification } from "../Utils/PushNoti";
import { emailToKey, keyToToken } from "../Utils/emailKeyConvert";
import { checkConversationSeenByUser, getConversationDisplayName, handleSeenByUser } from "../Utils/conversation";
import { useFiredux } from "../hooks/useFiredux";
import { BasicImage } from "../components/BasicImage";

const ScreenMessage = ({ route }) => {
  const navigation = useNavigation();
  const listRawUsers = useFiredux("user") ?? {};

  //#region  message properties
  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [messages, updateMessages] = useState([]);
  const [currentMessageText, updateText] = useState("");
  const [conversation] = useRealtimeFire("conversation", conversationId);
  const [justPressSend, setPress] = useState(false);
  const listAvaSeen = useMemo(() => {
    if (listRawUsers && conversation) {
      let result = Object.values(conversation?.listSeenMembers ?? {})
        ?.filter?.((email) => user?.email !== email)
        .map?.((email) => {
          return listRawUsers[emailToKey(email)]?.avaUrl;
        });
      return result;
    }
    return [];
  });
  //#endregion
  //#region audio properties
  //const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecordingVoice] = useState(null);
  const [sound, setSound] = useState(null);
  const [startRecord, setStartRecord] = useState(false);
  const [isPlayingAudio, setPlayingAudio] = useState(false);
  //#endregion
  //#region  Camera properties
  const [startCamera, setStartCamera] = useState(false);
  const camera = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewVideoVisible, setPreviewVideoVisible] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState("off");
  const [isRecording, setRecording] = useState(false);
  const [isExpanding, setExpand] = useState(false);
  //#endregion

  //getAll message of this conversation
  useEffect(() => {
    //console.log(conversation);
    fecthMessages();
  }, [conversation]);

  const fecthMessages = () => {
    // if (messages.length === 0) {
    let msgs = [];
    if (conversation?.listMessages) {
      let listMess = Object.values(conversation.listMessages);
      listMess.forEach((child) => {
        let msg = {
          Id: child.key,
          data: child.data,
        };
        if (msg.data) msgs.push(msg.data);
      });
    }
    msgs.sort((x, y) => x.createdAt < y.createdAt);
    updateMessages(msgs);
    return;
    // } else if (justPressSend) {
    //   let data = conversation?.lastestMessage;
    //   if (!data) return;
    //   console.log("Chun cute",data.toJSON());
    //   if (data.image || data.video || data.audio) data.text = "";
    //   let msgs = messages;
    //   msgs.push(data);
    //   msgs.sort((x, y) => x.createdAt < y.createdAt);
    //   updateMessages(msgs);
    //   setPress(false);
    // }
  };

  // seen message when user is in this conversation
  useEffect(() => {
    if (user?.email && conversation) {
      if (!checkConversationSeenByUser(user, conversation)) {
        handleSeenByUser(user?.email, conversationId, conversation);
      }
    }
  }, [user, conversation]);

  const handleInfoPress = (conversationId) => {
    //navigate to conversation info, for edit.
    //navigation.navigate(SCREENS.message.name);

    navigation.navigate(SCREENS.conversationInfo.name, { conversationId });
  };

  //send push notification
  const sendPushNotificationToMembers = async (message) => {
    let memberList = Object.values(conversation.listMembers);
    let countMember = memberList.length;
    memberList.forEach((member) => {
      if (member !== user.email) {
        var pushContent = {
          message: message.text,
          data: conversationId,
          sender: user?.displayName ? user.displayName : `${user?.firstName} ${user?.lastName}`,
        };
        if (countMember > 2) pushContent.sender += " to " + conversation.name;
        let membertoKey = emailToKey(`${member}`);
        Fire.get(`user/${membertoKey}/tokens`).then((userToken) => {
          Object.keys(userToken).forEach((key) => {
            sendPushNotification(keyToToken(key), pushContent).then(() => { });
          });
        });
      }
    });
  };

  // trigged when press send message, upload to Realtime
  const HandlePressSend = async (
    newMessages = [],
    videoLink,
    imageLink,
    voiceLink
  ) => {
    if (newMessages[0] === undefined) return;

    //#region upload image and video to Storage and then get link for realTime (if available)
    if (videoLink || imageLink || voiceLink) {
      let imageName = `Message_${Date.parse(newMessages[0].createdAt)}`;
      if (videoLink) {
        let result = await uploadPhotoAndGetLink(videoLink, imageName);
        newMessages[0].video = result;
      }
      if (imageLink) {
        let result = await uploadPhotoAndGetLink(imageLink, imageName);
        newMessages[0].image = result;
      }
      if (voiceLink) {
        let result = await uploadAudiotoFirebase(voiceLink, imageName);
        newMessages[0].audio = result;
      }
    }
    //#endregion

    let lastestMessage = newMessages[0]; //for sorting later

    let messageKey = newMessages[0].createdAt;

    if (!newMessages[0].user.avatar) newMessages[0].user.avatar = ""; //somehow if user doesn't have avatar, message won't be send

    newMessages[0].createdAt = Date.parse(newMessages[0].createdAt);

    await Fire.update(
      `conversation/${conversationId}/listMessages/${messageKey}`,
      {
        data: newMessages[0],
      }
    );
    await Fire.update(`conversation/${conversationId}/`, {
      listSeenMembers: [],
    });
    setPress(true);
    if (lastestMessage.video) {
      lastestMessage.text = "Send video";
    } else if (lastestMessage.image) {
      lastestMessage.text = "Send image";
    } else if (lastestMessage.audio) {
      lastestMessage.text = "Send voice";
    }
    await Fire.set(
      `conversation/${conversationId}/lastestMessage/`,
      lastestMessage
    );
    await sendPushNotificationToMembers(lastestMessage);
  };

  //#region Customize GiftedChat
  // footer seen member
  const renderFooter = (listAvaSeen) => {
    return (
      <Layout
        style={{
          width: "auto",
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          height: 32,
          marginRight: 8,
          backgroundColor: "transparent"
        }}
      >
        {listAvaSeen.map((url) =>
          <BasicImage
            icon={20}
            source={{ uri: url }}
            borderRadius={100}
          ></BasicImage>
        )}
      </Layout>
    );
  };

  //Chat bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "lavender",
          },
          left: {
            maxWidth: sizeFactor * 14,
            backgroundColor: "whitesmoke",
          },
        }}
        textStyle={{
          right: {
            color: "black",
          },
        }}
      />
    );
  };

  //send button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Layout
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon.Send style={{ width: 32, height: 32 }} />
        </Layout>
      </Send>
    );
  };
  // const renderLoading = (props) => {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#6646ee" />
  //     </View>
  //   );
  // };

  //text composer
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        multiline
        textInputStyle={{
          borderRadius: 8,
          backgroundColor: "whitesmoke",
          minWidth: "50%",
          //height: 32,
        }}
        //placeholderTextColor={{ marginHorizontal: 128 }}
        placeholder="Type your massage here..."
      />
    );
  };

  //textInput
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          //width: windowWidth,
          //backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          //padding:4,
          //height: 48,
          flexDirection: "row",
        }}
        primaryStyle={{
          // borderRadius: 70 / 3,
          width: windowWidth,
          //backgroundColor: "red",
          alignItems: "center",
          //height: 48,
          justifyContent: "space-between",
          flexDirection: "row",
          // width: sizeFactor * 15,
        }}
      />
    );
  };

  //extend action: Image, Camera,...
  const renderActions = (props) => {
    return props.isExpanding === false ? (
      <Button
        size="tiny"
        appearance="ghost"
        onPress={props.onPressExpand}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Icon.Add style={{ width: 24, height: 24 }} />
      </Button>
    ) : (
      <Layout
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          size="tiny"
          appearance="ghost"
          onPress={props.onPressCamera}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon.Camera style={{ width: 24, height: 24 }} />
        </Button>
        <Button
          size="tiny"
          appearance="ghost"
          onPress={props.onPressMedia}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon.Image style={{ width: 24, height: 24 }} />
        </Button>

        <Button
          size="tiny"
          appearance="ghost"
          onPress={props.onPressVoice}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {props.startRecord ? (
            <Icon.StopVoice style={{ width: 24, height: 24 }} />
          ) : (
            <Icon.Voice style={{ width: 24, height: 24 }} />
          )}
        </Button>
      </Layout>
    );
  };

  //if message is an image
  const renderMessageImage = (props) => {
    return (
      <MessageImage
        {...props}
        source={props.currentMessage.image}
        imageStyle={{ width: 200, height: 200 }}
      />
    );
  };

  //if message is a video
  const renderMessageVideo = (props) => {
    return (
      <Video
        resizeMode="contain"
        useNativeControls
        shouldPlay={false}
        source={{ uri: props.currentMessage.video }}
        style={{ width: 200, height: 300 }}
      />
    );
  };

  //if message is audio
  const renderMessageAudio = (props) => {
    const uri = props.currentMessage.audio;
    const soundObject = new Audio.Sound();
    const startSound = async () => {
      try {
        await soundObject.loadAsync({ uri });
        await soundObject.playAsync();
      } catch (error) {
        console.log("error:", error);
      }
    };
    const stopSound = async () => {
      await soundObject.stopAsync();
    };
    return props.isPlayingAudio ? (
      <Button
        onPress={() => {
          stopSound(), props.setPlayingAudio();
        }}
      >
        <Icon.Stop style={{ width: 24, height: 24 }} />
      </Button>
    ) : (
      <Button
        onPress={() => {
          startSound(), props.setPlayingAudio();
        }}
      >
        <Icon.Play style={{ width: 24, height: 24 }} />
      </Button>
    );
  };
  //imageButton pressed
  const MediaSend = async () => {
    // updateText("1 media added");
    let result = await pickProcess(false);
    let videoLink = null,
      imageLink = null;
    if (result.type === "video") videoLink = result.uri;
    else if (result.type === "image") imageLink = result.uri;
    await createFakeMessage(videoLink, imageLink, null);
  };
  //CameraButton pressed
  const CameraPress = async () => {
    let status = await getPermissions();
    if (status !== "granted") {
      alert("Please provide camera access");
      return;
    }
    let statusVoice = await getVoice();
    if (statusVoice !== "granted") {
      alert("Please provide microphone access");
      return;
    }
    setStartCamera(true);
  };
  //#endregion

  //#region  Upload image & video

  //press to take picture
  const takePicture = async () => {
    let photo = await camera.current.takePictureAsync({ quality: 0.5 });
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  //after taking photo, press save to camera_roll
  const savePhoto = async () => {
    const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    if (status !== "granted") {
      let ask = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (ask.status !== "granted") return;
    }
    await MediaLibrary.saveToLibraryAsync(capturedImage.uri).then(
      () => {
        alert("Saved");
        return;
      },
      (error) => {
        alert("Could not save");
        return;
      }
    );
  };
  //after taking photo, press to retake image
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setStartCamera(true);
  };

  //after taking photo, press to send
  const CameraSend = async () => {
    let imageLink = capturedImage.uri;
    let videoLink = null;
    setStartCamera(false);
    setPreviewVisible(false);
    setCapturedImage(null);
    await createFakeMessage(videoLink, imageLink, null);
  };

  //when press select||send image, auto send and create as a message
  const createFakeMessage = async (videoLink, imageLink, voiceLink) => {
    let fakeMessage = {
      _id: `${Date.parse(new Date())}`,
      createdAt: new Date(),
      text: "",
      user: {
        _id: `${user.email}`,
        avatar: `${user.avaUrl}`,
        name: user?.displayName ? user.displayName : `${user?.firstName} ${user?.lastName}`,
      },
    };
    let message = [];
    message.push(fakeMessage);
    await HandlePressSend(message, videoLink, imageLink, voiceLink);
  };

  const saveVideo = async () => {
    const { status } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    if (status !== "granted") {
      let ask = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (ask.status !== "granted") return;
    }
    console.log(capturedVideo);
    await MediaLibrary.saveToLibraryAsync(capturedVideo.uri).then(
      () => {
        alert("Saved");
        return;
      },
      (error) => {
        console.log(error);
        alert("Could not save");
        return;
      }
    );
  };

  const cancelVideo = () => {
    setCapturedVideo(null);
    setPreviewVideoVisible(false);
    setStartCamera(true);
    setRecording(false);
  };
  const sendVideo = async () => {
    let imageLink = null;
    let videoLink = capturedVideo.uri;
    setStartCamera(false);
    setPreviewVideoVisible(false);
    setCapturedVideo(null);
    setRecording(false);
    await createFakeMessage(videoLink, imageLink, null);
  };
  //record start
  const StartRecord = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status !== "granted") return;

    //console.log("video");
    //console.log("record", camera);
    if (camera.current)
      try {
        setRecording(true);
        let video = await camera.current.recordAsync({
          quality: Camera.Constants.VideoQuality["720p"],
          maxFileSize: 3000000,
        });
        //console.log("video", video);
        setCapturedVideo(video);
        setPreviewVideoVisible(true);
      } catch (e) {
        console.log(e);
      }
  };
  //record stop
  const StopRecord = () => {
    if (camera.current)
      try {
        setRecording(false);
        camera.current.stopRecording();
      } catch (e) {
        console.log(e);
      }
    //console.log("stop recording");
    //console.log("video captured", capturedVideo);
  };

  //#endregion
  //#region  Upload voice
  const recordingSettings = {
    android: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };
  const VoiceSend = async () => {
    let canSend = await preparedAudio();
    if (canSend) {
      uri = recording.getURI();
      createFakeMessage(null, null, uri);
    }
  };
  const preparedAudio = async () => {
    if (!startRecord) {
      if (sound !== null) {
        await sound.unloadAsync();
        sound.setOnPlaybackStatusUpdate(null);
        setSound(null);
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      const _recording = new Audio.Recording();
      try {
        await _recording.prepareToRecordAsync(recordingSettings);
        setRecordingVoice(_recording);
        await _recording.startAsync();
        //console.log("recording");
        setStartRecord(true);
      } catch (error) {
        console.log("error while recording:", error);
      }
      return false;
    } else {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        // Do nothing -- we are already unloaded.
      }
      setRecordingVoice(undefined);
      setStartRecord(false);
      //const info = await FileSystem.getInfoAsync(recording.getURI());
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      const { sound: _sound, status } =
        await recording.createNewLoadedSoundAsync({
          isLooping: true,
          isMuted: false,
          volume: 1.0,
          rate: 1.0,
          shouldCorrectPitch: true,
        });
      setSound(_sound);
      setStartRecord(false);
      return true;
    }
  };
  //#endregion
  //#region return options
  //CameraAndPreview
  const CameraAndPreview = () => {
    let photoPreview = previewVisible && capturedImage;
    let videoPreview = previewVideoVisible && capturedVideo;
    if (photoPreview)
      return (
        <CameraPreview
          photo={capturedImage}
          savePhoto={savePhoto}
          retakePicture={retakePicture}
          sendPhoto={CameraSend}
        />
      );
    if (videoPreview)
      return (
        <VideoPreview
          video={capturedVideo}
          cancelVideo={cancelVideo}
          saveVideo={saveVideo}
          sendVideo={sendVideo}
        />
      );
    return (
      <CustomizedCamera
        style={{ flex: 1, width: "100%", height: "100%" }}
        camera={camera}
        cameraType={cameraType}
        flashMode={flashMode}
        setCameraType={() => {
          if (cameraType === "back") {
            setCameraType("front");
          } else {
            setCameraType("back");
          }
        }}
        setStartCamera={() => {
          setStartCamera(false);
          setRecording(false);
        }}
        setFlashMode={() => {
          if (flashMode === "on") {
            setFlashMode("off");
          } else if (flashMode === "off") {
            setFlashMode("auto");
          } else if (flashMode === "auto") {
            setFlashMode("on");
          }
        }}
        takePicture={takePicture}
        StopRecord={StopRecord}
        recordStart={StartRecord}
        isRecording={isRecording}
      />
    );
  };
  const ReturnOptions = () => {
    if (startCamera) return <CameraAndPreview />;
    return (
      <Layout style={([styles.center], { flex: 1 })}>
        <Layout
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <BackAction></BackAction>
          <MessageCard
            onPress={() => handleInfoPress(conversationId)}
            name={getConversationDisplayName(user?.email, conversation, listRawUsers)}
            containerStyle={{ width: "60%", marginTop: 8 }}
            lastestChat="Last seen recently"
            ImageSize={48}
            imageSource={
              conversation?.avaUrl ??
              "https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/Logo.png?alt=media&token=1f67739c-177d-43f6-89e7-3dfefa8f828f"
            }
          />
          <Button appearance="ghost">
            <Icon.Call style={{ width: 24, height: 24 }} />
          </Button>
          <Button appearance="ghost">
            <Icon.VideoCam style={{ width: 24, height: 24 }} />
          </Button>
        </Layout>

        <Divider />

        <ImageBackground
          source={require("../assets/bg.png")}
          style={{ flex: 1, resizeMode: "cover" }}
          imageStyle={{ opacity: 0.3 }}
        >
          <GiftedChat
            keyboardShouldPersistTaps="handled"
            renderBubble={renderBubble}
            messages={messages}
            onSend={(newMessage) => {
              HandlePressSend(newMessage, null, null, null);
              setExpand(false);
            }}
            user={{
              _id: user?.email,
              avatar: user?.avaUrl,
              name: user?.displayName ? user.displayName : `${user?.firstName} ${user?.lastName}`,
            }}
            alignTop
            // onInputTextChanged={()=>setExpand(false)}
            //text={currentMessageText}
            //showUserAvatar
            //showAvatarForEveryMessage
            //renderUsernameOnMessage
            //isTyping={this.state.isTyping}
            renderFooter={() => renderFooter(listAvaSeen)}
            renderComposer={renderComposer}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
            //renderLoading={this.renderLoading}
            renderActions={renderActions}
            renderMessageVideo={renderMessageVideo}
            renderMessageImage={renderMessageImage}
            renderMessageAudio={renderMessageAudio}
            onPressCamera={CameraPress}
            onPressMedia={MediaSend}
            onPressVoice={VoiceSend}
            isExpanding={isExpanding}
            isPlayingAudio={isPlayingAudio}
            startRecord={startRecord}
            setPlayingAudio={() => {
              if (isPlayingAudio) {
                setPlayingAudio(false);
              } else setPlayingAudio(true);
            }}
            onPressExpand={() => setExpand(true)}
            onInputFocus={() => {
              setExpand(false);
            }}
          />
        </ImageBackground>
      </Layout>
    );
  };
  //#endregion

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={SafeView}>
        <Layout style={{ flex: 1 }}>{ReturnOptions()}</Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default ScreenMessage;
