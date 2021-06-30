import React from "react";
import {
  Bubble,
  Send,
  InputToolbar,
  Composer,
  MessageImage,
} from "react-native-gifted-chat";
import { Layout, Button } from "@ui-kitten/components";
import { BasicImage } from "../components/BasicImage";
import * as Icon from "../components/Icon";
import { Video, Audio } from "expo-av";
import { windowWidth, windowHeight, sizeFactor } from "../styles/Styles";
//#region Customize GiftedChat
// footer seen member
export const renderFooter = (listAvaSeen) => {
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
        backgroundColor: "transparent",
      }}
    >
      {listAvaSeen.map((url) => (
        <BasicImage
          icon={20}
          source={{ uri: url }}
          borderRadius={100}
        ></BasicImage>
      ))}
    </Layout>
  );
};

//Chat bubble
export const renderBubble = (props) => {
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
export const renderSend = (props) => {
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
export const renderComposer = (props) => {
  return (
    <Composer
      {...props}
      multiline
      //placeholderTextColor={{ marginHorizontal: 128 }}
      placeholder="What do you want to say ?"
    />
  );
};

//textInput
export const renderInputToolbar = (props) => {
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
export const renderActions = (props) => {
  return props.isExpanding === false ? (
    <Button
      size="tiny"
      appearance="ghost"
      onPress={props.onPressExpand}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
      }}
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
export const renderMessageImage = (props) => {
  return (
    <MessageImage
      {...props}
      source={props.currentMessage.image}
      imageStyle={{ width: 200, height: 200 }}
    />
  );
};

//if message is a video
export const renderMessageVideo = (props) => {
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
export const renderMessageAudio = (props) => {
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
//#endregion
