import React, { useEffect, useState, useRef } from "react";
import { Layout, Text } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  Image,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from ".";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Composer,
  Actions,
  MessageImage,
  AccessoryBar,
} from "react-native-gifted-chat";
import { Video } from "expo-av";
import { MessageCard } from "../components/MessageCard";
import { CameraPreview } from "../components/CameraPreview";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { sizeFactor, windowWidth } from "../styles/Styles";
import { Ionicons } from "@expo/vector-icons";
import {
  pickProcess,
  uploadPhotoAndGetLink,
  getVoice,
  getPermissions,
} from "../Utils/uploadPhotoVideo";
import * as MediaLibrary from "expo-media-library";

const ScreenMessage = ({ route }) => {
  const navigation = useNavigation();

  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [messages, updateMessages] = useState([]);
  const [currentMessageText, updateText] = useState("");
  const [conversation] = useRealtimeFire("conversation", conversationId);

  const [startCamera, setStartCamera] = useState(false);
  const camera = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState("off");
  // delete this when you're good
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
  const handleInfoPress = () => {
    //navigate tới thông tin nhóm chat, block các thứ
    //navigation.navigate(SCREENS.message.name);
  };
  const HandlePressSend = async (newMessages = [], videoLink, imageLink) => {
    if (newMessages[0] === undefined) return;

    let imageName = `Message_${Date.parse(newMessages[0].createdAt)}`;

    if (videoLink) {
      let result = await uploadPhotoAndGetLink(videoLink, imageName);
      newMessages[0].video = result;
    }
    if (imageLink) {
      let result = await uploadPhotoAndGetLink(imageLink, imageName);
      newMessages[0].image = result;
    }

    let lastestMessage = newMessages[0];
    let messageKey = newMessages[0].createdAt;
    if (!newMessages[0].user.avatar) newMessages[0].user.avatar = "";
    newMessages[0].createdAt = Date.parse(newMessages[0].createdAt);

    Fire.update(`conversation/${conversationId}/listMessages/${messageKey}`, {
      Data: newMessages[0],
    }).then(() => {
      if (lastestMessage.video) {
        lastestMessage.text = "Đã gửi video";
      } else if (lastestMessage.image) {
        lastestMessage.text = "Đã gửi ảnh";
      }
      Fire.set(
        `conversation/${conversationId}/lastestMessage/`,
        lastestMessage
      ).then(() => {});
    });
  };
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
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{ borderRadius: 70 / 3, backgroundColor: "whitesmoke" }}
        placeholder="Aa"
      />
    );
  };
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

  const savePhoto = async () => {
    console.log(capturedImage);
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
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setStartCamera(true);
  };
  const CameraPress = async () => {
    let status = await getPermissions();
    if (status !== "granted") {
      alert("Vui lòng cấp quyền truy cập máy ảnh");
      return;
    }
    let statusVoice = await getVoice();
    if (statusVoice !== "granted") {
      alert("Vui lòng cấp quyền truy cập microphone");
      return;
    }
    setStartCamera(true);
  };
  const takePicture = async () => {
    let photo = await camera.current.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  const CameraSend = async () => {
    let imageLink = capturedImage.uri;
    let videoLink = null;
    setStartCamera(false);
    await createFakeMessage(videoLink, imageLink);
  };
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
  const MediaSend = async () => {
    // updateText("1 media added");
    let result = await pickProcess(false);
    let videoLink = null,
      imageLink = null;
    if (result.type === "video") videoLink = result.uri;
    else if (result.type === "image") imageLink = result.uri;
    await createFakeMessage(videoLink, imageLink);
  };
  const renderMessageImage = (props) => {
    return (
      <MessageImage
        {...props}
        source={props.currentMessage.image}
        imageStyle={{ width: 200, height: 200 }}
      />
    );
  };

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

  return startCamera ? (
    previewVisible && capturedImage ? (
      <CameraPreview
        photo={capturedImage}
        savePhoto={savePhoto}
        retakePicture={retakePicture}
        sendPhoto={CameraSend}
      />
    ) : (
      <Camera
        style={{ flex: 1, width: "100%",height:"100%" }}
        ref={camera}
        type={cameraType}
        flashMode={flashMode}
      >
        <Layout
          style={{
            flexDirection: "column",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "flex-start",
            backgroundColor: "transparent",
          }}
        >
          <Layout
            style={{
            
             
              flexDirection: "row",
              flex: 1,
              width: "100%",
              padding: 20,
              justifyContent: "flex-end",
              backgroundColor: "transparent",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setStartCamera(false);
              }}
            >
            <Ionicons name="close" size={40} color="white"/>
            </TouchableOpacity>
          </Layout>
          <Layout
            style={{
              height: "15%",
              alignItems: "center",
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={() => {
                if (cameraType === "back") {
                  setCameraType("front");
                } else {
                  setCameraType("back");
                }
              }}
            >
              <Ionicons name="camera-reverse-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={{
                width: 80,
                height: 80,
                bottom: 0,
                borderRadius: 100,
                backgroundColor: "#ffffff",
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: "column",
                alignItems: "center",
                width: "10%",
              }}
              onPress={() => {
                if (flashMode === "on") {
                  setFlashMode("off");
                } else if (flashMode === "off") {
                  setFlashMode("auto");
                } else if (flashMode === "auto") {
                  setFlashMode("on");
                }
              }}
            >
              {flashMode === "off" ? (
                <Ionicons name="flash-off" size={24} color="white" />
              ) : (
                <Ionicons name="flash" size={24} color="white" />
              )}
              {flashMode === "auto" ? (
                <Text fontSize={10} style={{ color: "white" }}>
                  Auto
                </Text>
              ) : null}
            </TouchableOpacity>
          </Layout>
        </Layout>
      </Camera>
    )
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
                  containerStyle={{ backgroundColor: "black" }}
                  name={conversationId}
                  lastestChat="Hoạt động lúc nào đó"
                  ImageSize={60}
                  imageSource="https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/Logo.png?alt=media&token=1f67739c-177d-43f6-89e7-3dfefa8f828f"
                />
              </TouchableOpacity>
              <GiftedChat
                keyboardShouldPersistTaps="handled"
                renderBubble={renderBubble}
                messages={messages}
                onSend={(newMessage) => HandlePressSend(newMessage, null, null)}
                user={{
                  _id: user?.email,
                  avatar: user?.avaUrl,
                  name: `${user?.firstName} ${user?.lastName}`,
                }}
                onInputTextChanged={(text) => updateText(text)}
                text={currentMessageText}
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

export default ScreenMessage;
