import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import { Image, ScrollView, ImageBackground, SafeAreaView } from "react-native";
import { Styles, sizeFactor } from "../styles/Styles";
import { SearchBar } from "react-native-elements";

const BasicImage = (props) => {
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
const MessageCard = (props) => {
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
const ScreenConversations = () => {
  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Layout style={{ flex: 1 }}>
            <ScrollView>
              <Layout style={[styles.center]}>
              <SearchBar
                platform="ios"
                placeholder="Tìm bạn bè..."
                lightTheme="true"
                containerStyle={{
                  marginHorizontal: 8,
                  backgroundColor: "transparent",
                  width: "95%",
                }}
                inputContainerStyle={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 23,
                }}
                leftIconContainerStyle={{ marginLeft: 16 }}
                inputStyle={{}}
                placeholder="Tìm kiếm bạn bè.."
                // onChangeText={(Text) => {
                //   this.setState({ toSearchText: Text });
                //   this.onChangeSearchText(Text);
                // }}
                // value={this.state.toSearchText}
              />
                {/*  Binding message list */}
                <MessageCard Name="Chó" LastestChat="aaa" ImageSource="../assets/bg.png"/>
              </Layout>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenConversations;
