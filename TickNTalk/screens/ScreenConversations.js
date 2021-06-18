import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from ".";
import { MessageCard } from "../components/MessageCard";
import { useFiredux } from "../hooks/useFiredux";
import * as Icon from "../components/Icon";
import {SafeView, Styles} from '../styles/Styles';

const ScreenConversations = () => {
  const navigation = useNavigation();
  const listConversations = Object.entries(
    useFiredux("conversation") ?? {}
  ).map((c) => ({ key: c[0], value: c[1] }));

  const handleMessagePress = (conversationId) => {
    navigation.navigate(SCREENS.message.name, { conversationId });
  };

  const handleCreateConversationPress = () => {
    navigation.navigate(SCREENS.createConversation.name);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={SafeView}>
          <Layout style={{ flex: 1 }}>
            <Layout style={[styles.center]}>
              <Layout
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <SearchBar
                  platform="ios"
                  placeholder="Search for conversation"
                  lightTheme="true"
                  containerStyle={{
                    marginHorizontal: 8,
                    backgroundColor: "transparent",
                    width: "95%",
                    flex: 4,
                  }}
                  inputContainerStyle={{
                    backgroundColor: "whitesmoke",
                    borderRadius: 23,
                  }}
                  leftIconContainerStyle={{ marginLeft: 16 }}
                  inputStyle={{}}
                  // onChangeText={(Text) => {
                  //   this.setState({ toSearchText: Text });
                  //   this.onChangeSearchText(Text);
                  // }}
                  // value={this.state.toSearchText}
                />

                <Icon.Add
                  style={{ width: 48, height: 48 }}
                  onPress={handleCreateConversationPress}
                />
              </Layout>
              {/*  Binding message list */}
              <ScrollView>
                {listConversations.map((conversation) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleMessagePress(conversation.key);
                    }}
                  >
                    <MessageCard
                      name={conversation.key}
                      lastestChat={conversation.key}
                      imageSource="../assets/bg.png"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Layout>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenConversations;
