import React, { useEffect } from "react";
import { Layout, Text } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  Image,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Platform,
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
import { MessageCard } from "../components/MessageCard";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { SafeView, Styles } from "../styles/Styles";

const ScreenMessage = ({ route }) => {
  const navigation = useNavigation();
  const { conversationId } = route?.params ?? {};
  const [conversation] = useRealtimeFire("conversation", conversationId);

  // delete this when you're good
  useEffect(() => {
    console.log("TESTING:", conversation);
  }, [conversation]);

  const handleInfoPress = () => {
    //navigate tới thông tin nhóm chat, block các thứ
    //navigation.navigate(SCREENS.message.name);
  };

  const renderBubble = ({ route }) => {
    return (
      <Layout style={{height: "100%"}}>
        <Bubble
          {...props}
          flex={1}
          wrapperStyle={{
            right: {
              backgroundColor: colors.lightpink,
            },
            left: {
              maxWidth: sizeFactor * 14,
              backgroundColor: colors.gray5,
            },
          }}
          textStyle={{
            right: {
              color: "#fff",
            },
          }}
        />
      </Layout>
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Ionicons name="md-send" size={32} color={colors.Darkpink} />
        </View>
      </Send>
    );
  };
  const renderLoading = (props) => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  };
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
          // width: windowWidth,
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
      <View style={styles.customActionsContainer}>
        <ButtonIcon
          MaterialFamilyIconName="image"
          color={colors.pink}
          size={24}
          onPress={props.onPressCamera}
        />
        <ButtonIcon
          MaterialFamilyIconName="videocam"
          color={colors.pink}
          size={24}
          onPress={props.onPressVideo}
        />
      </View>
    );
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
  return (
    <SafeAreaView style={SafeView}>
      <Layout style={{ flex: 1 }}>
        <Layout style={([styles.center], { flex: 1 })}>
          <TouchableOpacity onPress={handleInfoPress}>
            <MessageCard
              name="Tên người dùng này"
              lastestChat="Hoạt động lúc nào đó"
              imageSource="../assets/bg.png"
            />
          </TouchableOpacity>
          <GiftedChat
            keyboardShouldPersistTaps="handled"
            renderBubble={renderBubble}
            //messages={this.state.messages}
            // onSend={(newMessage) => this.HandlePressSend(newMessage)}
            // user={{
            //   _id: this.props.loggedInEmail.toUpperCase(),
            //   avatar: this.props.curAva,
            //   name: this.props.curName,
            // }}
            onInputTextChanged={(text) => {}}
            //text={} current text
            //showUserAvatar
            //showAvatarForEveryMessage
            renderUsernameOnMessage
            //isTyping={this.state.isTyping}
            //renderFooter={() => this.renderFooter(this.state.listAvaSeen)}
            renderComposer={renderComposer}
            renderInputToolbar={renderInputToolbar}
            //renderSend={this.renderSend}
            //renderLoading={this.renderLoading}
            //renderActions={this.renderActions}
            //renderMessageVideo={this.renderMessageVideo}
            //renderMessageImage={this.renderMessageImage}
            //onPressVideo={this.VideoSend}
            //onPressCamera={this.ImageSend}
          />
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default ScreenMessage;
