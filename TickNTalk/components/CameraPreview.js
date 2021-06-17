import React from "react";
import { Layout ,Text} from "@ui-kitten/components";
import { ImageBackground, TouchableOpacity } from "react-native";

export const CameraPreview = ({
  photo,
  retakePicture,
  savePhoto,
  sendPhoto,
}) => {
  return (
    <Layout
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <Layout
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                }}
              >
                ReTake
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendPhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                }}
              >
                Send
              </Text>
            </TouchableOpacity>
          </Layout>
        </Layout>
      </ImageBackground>
    </Layout>
  );
};
