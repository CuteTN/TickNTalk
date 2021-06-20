import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { TouchableOpacity, SafeAreaView } from "react-native";
import { Video } from "expo-av";
import { windowWidth, windowHeight } from "../styles/Styles";

const VideoPreview = ({ video, saveVideo, cancelVideo, sendVideo }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          width: windowWidth,
          height: windowHeight,
        }}
      >
        <Layout
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            height: "10%",
            width: "100%",
            backgroundColor: "whitesmoke",
          }}
        >
          <TouchableOpacity onPress={cancelVideo}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveVideo}>
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendVideo}>
            <Text>Send</Text>
          </TouchableOpacity>
        </Layout>
        <Video
          source={{ uri: video.uri }}
          resizeMode="contain"
          shouldPlay
          style={{ width: windowWidth, height: "90%" }}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default VideoPreview;
