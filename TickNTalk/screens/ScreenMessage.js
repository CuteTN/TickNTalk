import React, { useEffect, useState, useRef } from "react";
import { Layout } from "@ui-kitten/components";
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
} from "react-native-gifted-chat";
import { Video } from "expo-av";
import { MessageCard } from "../components/MessageCard";
import { CameraPreview } from "../components/CameraPreview";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import { CustomizedCamera } from "../components/CustomizedCamera";
import { sizeFactor, windowWidth } from "../styles/Styles";
import { Ionicons } from "@expo/vector-icons";
import {
  pickProcess,
  uploadPhotoAndGetLink,
  getVoice,
  getPermissions,
} from "../Utils/uploadPhotoVideo";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import { SCREENS } from ".";

const ScreenMessage = ({ route }) => {
  const navigation = useNavigation();
  
  //#region  message properties
  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [messages, updateMessages] = useState([]);
  const [currentMessageText, updateText] = useState("");
  const [conversation] = useRealtimeFire("conversation", conversationId);
  //#region

  //#region  Camera properties
  const [startCamera, setStartCamera] = useState(false);
  const camera = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState("off");
  const [isRecording, setRecording] = useState(false);
  //#endregion

  //getAll message of this conversation
  useEffect(() => {
    //console.log(conversation);
    fecthMessages();
  }, [conversation]);
  const fecthMessages = () => {
    let msgs = [];
    if (conversation?.listMessages) {
      let listMess = Object.values(conversation.listMessages);
      listMess.forEach((child) => {
        let msg = {
          Id: child.key,
          Data: child.Data,
        };
        if (msg.Data) msgs.push(msg.Data);
      });
    }
    msgs.sort((x, y) => x.createdAt < y.createdAt);
    updateMessages(msgs);
  };

  const handleInfoPress = (conversationId) => {
    //navigate to conversation info, for edit.
    //navigation.navigate(SCREENS.message.name);
    
      navigation.navigate(SCREENS.conversationInfo.name, { conversationId });
    
  };
  // trigged when press send message, upload to Realtime
  const HandlePressSend = async (newMessages = [], videoLink, imageLink) => {
    if (newMessages[0] === undefined) return;

    //#region upload image and video to Storage and then get link for realTime (if available)
    let imageName = `Message_${Date.parse(newMessages[0].createdAt)}`;
    if (videoLink) {
      let result = await uploadPhotoAndGetLink(videoLink, imageName);
      newMessages[0].video = result;
    }
    if (imageLink) {
      let result = await uploadPhotoAndGetLink(imageLink, imageName);
      newMessages[0].image = result;
    }
    //#endregion

    let lastestMessage = newMessages[0]; //for sorting later

    let messageKey = newMessages[0].createdAt;

    if (!newMessages[0].user.avatar) newMessages[0].user.avatar = ""; //somehow if user doesn't have avatar, message won't be send

    newMessages[0].createdAt = Date.parse(newMessages[0].createdAt);

    Fire.update(`conversation/${conversationId}/listMessages/${messageKey}`, {
      Data: newMessages[0],
    }).then(() => {
      if (lastestMessage.video) {
        lastestMessage.text = "Send video";
      } else if (lastestMessage.image) {
        lastestMessage.text = "Send image";
      }
      Fire.set(
        `conversation/${conversationId}/lastestMessage/`,
        lastestMessage
      ).then(() => {});
    });
  };

  //#region Customize GiftedChat

  //Chat bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "blue",
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
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons name="md-send" size={32} color="black" />
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
        textInputStyle={{ borderRadius: 70 / 3, backgroundColor: "whitesmoke" }}
        placeholder="Aa"
      />
    );
  };

  //textInput
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          width: windowWidth,
          // backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          //padding:4,
          height: "auto",
          flexDirection: "row",
        }}
        primaryStyle={{
          // borderRadius: 70 / 3,
          // backgroundColor: colors.white,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          // width: sizeFactor * 15,
        }}
      />
    );
  };

  //extend action: Image, Camera,...
  const renderActions = (props) => {
    return (
      <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            //backgroundColor: "red",
            width: 50,
            height: 50,
            borderRadius: 70 / 5,
          }}
          onPress={props.onPressCamera}
        >
          <Ionicons name="camera" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            //backgroundColor: "red",
            width: 50,
            height: 50,
            borderRadius: 70 / 5,
          }}
          onPress={props.onPressMedia}
        >
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>
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

  //imageButton pressed
  const MediaSend = async () => {
    // updateText("1 media added");
    let result = await pickProcess(false);
    let videoLink = null,
      imageLink = null;
    if (result.type === "video") videoLink = result.uri;
    else if (result.type === "image") imageLink = result.uri;
    await createFakeMessage(videoLink, imageLink);
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
    let photo = await camera.current.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  //after taking photo, press save to camera_roll
  const savePhoto = async () => {
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
    await createFakeMessage(videoLink, imageLink);
  };

  //when press select||send image, auto send and create as a message
  const createFakeMessage = async (videoLink, imageLink) => {
    let fakeMessage = {
      _id: `${Date.parse(new Date())}`,
      createdAt: new Date(),
      text: "",
      user: {
        _id: `${user.email}`,
        avatar: `${user.avaUrl}`,
        name: `${user.firstName} ${user.lastName}`,
      },
    };
    let message = [];
    message.push(fakeMessage);
    await HandlePressSend(message, videoLink, imageLink);
  };
  //record start
  const StartRecord = async () => {
    const { status } = await Camera.getPermissionsAsync();
    if (status !== "granted") return;
    setRecording(true);
    console.log("video");
    console.log("record", camera);
    if (camera) {
      let video = await camera.current.recordAsync({
        // maxDuration:90,
      });
      console.log("video", video);
      setCapturedVideo(video);
    }
  };
  //record stop
  const StopRecord = async () => {
    setRecording(false);
    await camera.current.stopRecording();
    console.log("stop recording");
    console.log("video captured", capturedVideo);
  };
  //CameraAndPreview
  const CameraAndPreview = () => {
    return previewVisible && capturedImage ? (
      <CameraPreview
        photo={capturedImage}
        savePhoto={savePhoto}
        retakePicture={retakePicture}
        sendPhoto={CameraSend}
      />
    ) : (
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
  //#endregion

  //#region return options
  const ReturnOptions = () => {
    return startCamera ? (
      <CameraAndPreview />
    ) : (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flex: 1 }}>
          <ImageBackground
            source={require("../assets/bg.png")}
            style={{ flex: 1, resizeMode: "cover" }}
          >
            <Layout style={{ flex: 1 }}>
              <Layout style={([styles.center], { flex: 1 })}>
                <TouchableOpacity onPress={handleInfoPress}>
                  <MessageCard
                  onPress={()=>handleInfoPress(conversationId)}
                    containerStyle={{ backgroundColor: "white" }}
                    name={conversation?.name}
                    lastestChat="Hoạt động lúc nào đó"
                    ImageSize={60}
                    imageSource={conversation?.avaUrl}
                  />
                </TouchableOpacity>
                <GiftedChat
                  keyboardShouldPersistTaps="handled"
                  renderBubble={renderBubble}
                  messages={messages}
                  onSend={(newMessage) =>
                    HandlePressSend(newMessage, null, null)
                  }
                  user={{
                    _id: user?.email,
                    avatar: user?.avaUrl,
                    name: `${user?.firstName} ${user?.lastName}`,
                  }}
                  //onInputTextChanged={(text) => updateText(text)}
                  //text={currentMessageText}
                  //showUserAvatar
                  //showAvatarForEveryMessage
                  renderUsernameOnMessage
                  //isTyping={this.state.isTyping}
                  //renderFooter={() => this.renderFooter(this.state.listAvaSeen)} có thể dùng để hiện thị danh sách người dùng đã seen
                  renderComposer={renderComposer}
                  renderInputToolbar={renderInputToolbar}
                  renderSend={renderSend}
                  //renderLoading={this.renderLoading}
                  renderActions={renderActions}
                  renderMessageVideo={renderMessageVideo}
                  renderMessageImage={renderMessageImage}
                  onPressCamera={CameraPress}
                  onPressMedia={MediaSend}
                />
              </Layout>
            </Layout>
          </ImageBackground>
        </Layout>
      </SafeAreaView>
    );
  };
  //#endregion

  return <ReturnOptions />;
};

export default ScreenMessage;
