import React from "react";
import { Camera } from "expo-camera";
import { Layout, Text } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const CustomizedCamera = ({
  isRecording,
  flashMode,
  camera,
  cameraType,
  setStartCamera,
  setCameraType,
  setFlashMode,
  takePicture,
  recordStart,
  StopRecord
}) => {
  return (
    <Camera
      style={{ flex: 1, width: "100%", height: "100%" }}
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
          <TouchableOpacity onPress={setStartCamera}>
            <Ionicons name="close" size={40} color="white" />
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
          <TouchableOpacity style={{ width: "10%" }} onPress={setCameraType}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>

          {isRecording ? (
            <TouchableOpacity
              onPress={StopRecord}
              style={{
                width: 80,
                height: 80,
                bottom: 0,
                borderRadius: 100,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="square" size={24} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={takePicture}
              onLongPress={recordStart}
              style={{
                width: 80,
                height: 80,
                bottom: 0,
                borderRadius: 100,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              flexDirection: "column",
              alignItems: "center",
              width: "10%",
            }}
            onPress={setFlashMode}
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
  );
};
