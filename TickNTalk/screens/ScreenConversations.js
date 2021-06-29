import React, { useEffect, useState } from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
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
import {
  checkConversationHasUser,
  checkConversationSeenByUser,
} from "../Utils/conversation";
import { useSignedIn } from "../hooks/useSignedIn";
import {
  BottomModal,
  ModalContent,
  ModalButton,
  SlideAnimation,
} from "react-native-modals";

import { ScreenSplash } from "./ScreenSplash";

const DATA = [
  {
    text: "BLOCK",
    func: () => {},
  },
  {
    text: "BLOCK AGAIN",
    func: () => {},
  },
  {
    text: "BLOCK ONE MORE TIME",
    func: () => {},
  },
];

const ScreenConversations = () => {
  const [searchText, setSearchText] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);

  function setModalContent(newData) {
    //newData is an array contains of [{title, function}]
    const renderItem = ({ item }) => (
      <Button
        appearance="ghost"
        onPress={() => {
          item.func;
        }}
      >
        {item.text}
      </Button>
    );
    console.log(newData);
    return (
      <ModalContent>
        <FlatList data={newData} renderItem={renderItem} />
      </ModalContent>
    );
  }
  const modalContent = setModalContent(DATA);

  const navigation = useNavigation();
  const listRawConversations = useFiredux("conversation") ?? {};
  const listRawUsers = useFiredux("user") ?? {};

  const { user } = useSignedIn();

  const listConversations = React.useMemo(() => {
    return Object.entries(listRawConversations ?? {})
      .filter((c) => checkConversationHasUser(user?.email, c[1]))
      .map((c) => ({ key: c[0], value: c[1] }));
  }, [listRawConversations, user]);

  // same as list conversation but is sorted to fit search text
  const [searchedConversations, setSearchedConversations] = useState([]);

  useEffect(() => {
    if (searchText && listConversations) {
      let searchResult = [];

      listConversations.forEach((c) => {
        const matchPoint = matchPointConversation(
          searchText,
          c.value,
          listRawUsers
        );

        if (matchPoint > 0)
          searchResult.push({
            ...c,
            matchPoint,
          });
      });

      searchResult.sort((c1, c2) => c2.matchPoint - c1.matchPoint);
      setSearchedConversations(searchResult);
    }
  }, [searchText, listConversations]);

  const handleMessagePress = (conversationId) => {
    navigation.navigate(SCREENS.message.name, { conversationId });
  };
  const handleMessageLongPress = (conversationId) => {
    setModalVisibility(true);
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

  //LOADING EFFET
  const [load, setLoad] = useSate(false);
  useEffect(() => {
    setLoad(true);
  });

  if (!load) return <ScreenSplash/>
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
                <Icon.AddCircle style={{ width: 48, height: 48 }} />
              </TouchableOpacity>
            </Layout>
            {/*  Binding message list */}
            <ScrollView>
              {(searchText ? searchedConversations : listConversations) // first, decide which list to render
                .map((conversation) => (
                  <MessageCard
                    onPress={() => {
                      handleMessagePress(conversation.key);
                    }}
                    onLongPress={() => {
                      handleMessageLongPress(conversation.key);
                    }}
                    name={conversation.value.name}
                    lastestChat={dataToText_LastestMessage(
                      conversation.value.lastestMessage
                    )}
                    isRead={checkConversationSeenByUser(
                      user.email,
                      conversation.value
                    )}
                    time={dataToText_Time(conversation.value.lastestMessage)}
                    ImageSize={60}
                    imageSource={
                      conversation.value.avaUrl ??
                      "https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/Logo.png?alt=media&token=1f67739c-177d-43f6-89e7-3dfefa8f828f"
                    }
                  />
                ))}
            </ScrollView>
          </Layout>

          {/* MODAL */}
          <BottomModal
            visible={modalVisibility}
            onTouchOutside={() => {
              setModalVisibility(modalVisibility ? false : true);
            }}
            modalAnimation={
              new SlideAnimation({
                slideFrom: "bottom",
              })
            }
            swipeDirection={["up", "down"]}
          >
            {modalContent}
          </BottomModal>
        </ImageBackground>
      </Layout>
    </SafeAreaView>
  );
};

export default ScreenConversations;
