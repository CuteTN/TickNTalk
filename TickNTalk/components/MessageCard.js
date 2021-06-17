import { Styles, sizeFactor } from "../styles/Styles";
import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { BasicImage } from "./BasicImage";
import {TouchableOpacity} from "react-native";

export const MessageCard = ({
  containerStyle,
  onPress,
  touchable,
  onLongPress,
  ImageSize,
  imageSource,
  textContainerStyle,
  time,
  name,
  lastestChat,
  isRead,
}) => {
  return (
    <TouchableOpacity
      style={[Styles.MessageCard, containerStyle]}
      onPress={onPress}
      enabled={touchable}
      onLongPress={onLongPress}
    >
      <BasicImage
        icon={ImageSize}
        source={{ uri: imageSource }}
        borderRadius={100}
      ></BasicImage>
      <Layout
        style={[
          {
            paddingTop: 5,
            paddingLeft: 5,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          },
          textContainerStyle,
        ]}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: sizeFactor,
            color: "black",
          }}
        >
          {name}
        </Text>
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between",backgroundColor: "transparent"}}
        >
          <Text
            style={{
              width: sizeFactor * 14,
              fontWeight: isRead ? "normal" : "bold",
            }}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {lastestChat}
          </Text>
          <Text
            style={{
              width: sizeFactor * 3,
              fontWeight: isRead ? "normal" : "bold",
            }}
            numberOfLines={1}
          >
            {time}
          </Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};
