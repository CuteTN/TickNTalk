import React, { useEffect, useState, useRef, useMemo } from "react";
import { Layout, Button, Divider } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import { ImageBackground, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  renderActions,
  renderBubble,
  renderComposer,
  renderMessageAudio,
  renderInputToolbar,
  renderSend,
  renderMessageImage,
  renderMessageVideo,
  renderFooter,
} from "../Utils/GiftedChatCustomize";
import { Audio } from "expo-av";
import { MessageCard } from "../components/MessageCard";
import CameraPreview from "../components/CameraPreview";
import VideoPreview from "../components/VideoPreview";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import { CustomizedCamera } from "../components/CustomizedCamera";
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
import { SafeView } from "../styles/Styles";
import * as Icon from "../components/Icon";
import * as Permissions from "expo-permissions";
import { sendPushNotification } from "../Utils/PushNoti";
import { emailToKey, keyToToken } from "../Utils/emailKeyConvert";
import {
  checkConversationSeenByUser,
  getConversationDisplayName,
  handleSeenByUser,
} from "../Utils/conversation";
import { useFiredux } from "../hooks/useFiredux";
import { recordingSettings } from "../Utils/MediaManager";
import { checkBlockedByUser } from "../Utils/user";
import { showMessage } from "react-native-flash-message";

const ScreenMessage = ({ route }) => {
  const navigation = useNavigation();
  const listRawUsers = useFiredux("user") ?? {};

  //#region  message properties
  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [messages, updateMessages] = useState([]);
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

  const isMessageSendable = useMemo(
    /**
     * @returns {{isValid: boolean, message: string}}
     */
    () => {
      if (conversation && listRawUsers) {
        if (conversation.type === "private") {
          const listMembers = Object.values(conversation.listMembers ?? {})
            .map(email => emailToKey(email))
            .map(key => listRawUsers[key]);

          for (let i = 0; i <= 1; i++)
            if (checkBlockedByUser(listMembers[i], listMembers[1 - i]?.email))
              return {
                isValid: false,
                message: "This contact is not available now.",
              }
        }

        return {
          isValid: true,
        };
      }

      return {
        isValid: false,
        message: "Something went wrong.",
      }
    },
    [listRawUsers, conversation]
  );

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
        if (msg.data) {
          let data = msg.data;
          msgs.push(data);
        }
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
  useEffect(() => {
    //console.log(messages);
  },[messages])
  useEffect(() => {
    if (conversation?.listMessages) {
      let listMess = Object.values(conversation?.listMessages);
      listMess.forEach((child) => {
        let msg = {
          Id: child.key,
          data: child.data,
        };
        //console.log('child',child);
        if (msg.data) {
          let data = msg.data;
          if (data.user._id === user?.email) {
            data.user.name = user?.displayName ?? user?.firstName + " " + user?.lastName;
            data.user.avatar = user?.avaUrl;
            Fire.update(`conversation/${conversationId}/listMessages/${data._id}/`, { data }).then(() => {
            })
          }
        }
      });
    }

  }, [user]);

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
          sender: user?.displayName
            ? user.displayName
            : `${user?.firstName} ${user?.lastName}`,
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

    if (!isMessageSendable.isValid) {
      showMessage({
        message: isMessageSendable.message,
        type: "danger",
      })

      return;
    }

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

    let messageKey = newMessages[0]._id;

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
        name: user?.displayName
          ? user.displayName
          : `${user?.firstName} ${user?.lastName}`,
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
            name={getConversationDisplayName(
              user?.email,
              conversation,
              listRawUsers
            )}
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
              name: user?.displayName
                ? user.displayName
                : `${user?.firstName} ${user?.lastName}`,
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
