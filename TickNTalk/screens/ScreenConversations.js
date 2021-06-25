import React, { useEffect, useState } from "react";
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
import { SafeView, Styles } from "../styles/Styles";
import { TopNavigationBar } from "../components/TopNavigationBar";
import { matchPointConversation } from "../Utils/search";

const ScreenConversations = () => {
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();
  const listRawConversations = useFiredux("conversation") ?? {};
  const listRawUsers = useFiredux("user") ?? {};

  const listConversations = React.useMemo(() => {
    return Object.entries(listRawConversations ?? {})
      .map((c) => ({ key: c[0], value: c[1] }));
  }, [listRawConversations])

  // same as list conversation but is sorted to fit search text
  const [searchedConversations, setSearchedConversations] = useState([]);

  useEffect(() => {
    if (searchText && listConversations) {
      let searchResult = [];

      listConversations.forEach(c => {
        const matchPoint = matchPointConversation(searchText, c.value, listRawUsers);

        if (matchPoint)
          searchResult.push({
            ...c,
            matchPoint
          })
      });

      searchResult.sort((c1, c2) => c2.matchPoint - c1.matchPoint);
      setSearchedConversations(searchResult);
    }
  }, [searchText, listConversations])

  const handleMessagePress = (conversationId) => {
    navigation.navigate(SCREENS.message.name, { conversationId });
  };

  const handleCreateConversationPress = () => {
    navigation.navigate(SCREENS.createConversation.name);
  };
  const dataToText_LastestMessage = (value) => {
    if (!value) return "";
    return `${value?.user.name}: ${value?.text}`;
  };
  const dataToText_Time = (value) => {
    if (!value) return "";
    let result = new Date(value?.createdAt);
    return `${result.getHours()}:${result.getMinutes()}`;
  };
  return (
    <SafeAreaView style={SafeView}>
      <TopNavigationBar title="Conversations" />
      <Layout style={{ flex: 1 }}>
        <ImageBackground
          source={require("../assets/bg.png")}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <Layout style={({ flex: 1 }, [styles.center])}>
            <Layout
              style={{
                display: "flex",
                flexDirection: "row",
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
                  flex: 5,
                }}
                inputContainerStyle={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 23,
                }}
                leftIconContainerStyle={{ marginLeft: 16 }}
                inputStyle={{}}

                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity onPress={handleCreateConversationPress}>
                <Icon.AddCircle
                  style={{ width: 48, height: 48 }}

                />
              </TouchableOpacity>
            </Layout>
            {/*  Binding message list */}
            <ScrollView>
              {
                (searchText ? searchedConversations : listConversations) // first, decide which list to render
                  .map((conversation) => (
                    <MessageCard
                      onPress={() => {
                        handleMessagePress(conversation.key);
                      }}
                      name={conversation.value.name}
                      lastestChat={dataToText_LastestMessage(
                        conversation.value.lastestMessage
                      )}
                      time={dataToText_Time(conversation.value.lastestMessage)}
                      ImageSize={60}
                      imageSource={conversation.value.avaUrl ?? "https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/Logo.png?alt=media&token=1f67739c-177d-43f6-89e7-3dfefa8f828f"}
                    />
                  ))}
            </ScrollView>
          </Layout>
        </ImageBackground>
      </Layout>
    </SafeAreaView>
  );
};

export default ScreenConversations;
