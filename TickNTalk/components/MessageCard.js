import { Styles, sizeFactor } from "../styles/Styles";
import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { BasicImage } from "./BasicImage";

export const MessageCard = (props) => {
  return (
    <Layout
      {...props}
      style={[Styles.MessageCard, props.containerStyle]}
      onPress={props.onPress}
      enabled={props.touchable}
      onLongPress={props.onLongPress}
    >
      <BasicImage
        icon={props.ImageSize}
        source={{ uri: props.imageSource }}
        borderRadius={100}
      ></BasicImage>
      <Layout
        style={[
          {
            paddingTop: 5,
            paddingLeft: 5,
            flexDirection: "column",
            justifyContent: "space-between",
          },
          props.textContainerStyle,
        ]}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: sizeFactor,
            color: "black",
          }}
        >
          {props.name}
        </Text>
        <Text
          style={{
            width: sizeFactor * 19,
            fontWeight: props.isRead ? "normal" : "bold",
          }}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {props.lastestChat}
        </Text>
      </Layout>
    </Layout>
  );
};