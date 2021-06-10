import { Styles, sizeFactor } from "../styles/Styles";
import React from "react";
import {Layout, Text} from "@ui-kitten/components";
import {Image} from 'react-native'

export const BasicImage = (props) => {
    return (
      <Image
        style={[
          {
            width: props.Icon,
            height: props.Icon,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: props.Round,
          },
          props.style,
        ]}
        source={props.source}
      />
    );
  };
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
          Icon={60}
          Icon={props.ImageSize}
          source={{ uri: props.ImageSource }}
          Round={100}
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
            {props.Name}
          </Text>
          <Text
            style={{
              width: sizeFactor * 19,
              fontWeight: props.isRead ? "normal" : "bold",
            }}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {props.LastestChat}
          </Text>
        </Layout>
      </Layout>
    );
  };