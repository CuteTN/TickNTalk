import React, { useEffect, useState } from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
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
  getConversationDisplayName,
  getOtherUsersInConversation,
  handleRemoveMember,
  handleSeenByUser,
  handleUnseenByUser,
} from "../Utils/conversation";
import { useSignedIn } from "../hooks/useSignedIn";
import {
  BottomModal,
  ModalContent,
  ModalButton,
  SlideAnimation,
} from "react-native-modals";
import ActionButton from 'react-native-action-button';

import { ScreenSplash } from "./ScreenSplash";

import { handleBlockUser, handleUnblockUser } from "../Utils/user";
import { useRef } from "react";
import Fire from "../firebase/Fire";

const ScreenConversations = () => {
  const [searchText, setSearchText] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const longPressedConversationId = useRef("");

  const [modalContent, setModalContent] = useState([]);

  function convertToModalContent(newData) {
    //newData is an array contains of [{title, function}]
    const renderItem = ({ item }) => (
      <Button
        appearance="ghost"
        onPress={() => { item.onPress(); setModalVisibility(false) }}
      >
        {item.text}
      </Button>
    );

    return (
      <ModalContent>
        <FlatList data={newData} renderItem={renderItem} />
      </ModalContent>
    );
  }

  const navigation = useNavigation();
  const listRawConversations = useFiredux("conversation") ?? {};
  const listRawUsers = useFiredux("user") ?? {};

  const { user } = useSignedIn();

  const listConversations = React.useMemo(() => {
    return Object.entries(listRawConversations ?? {})
      .filter((c) => checkConversationHasUser(user?.email, c[1]))
      .map((c) => ({ key: c[0], value: c[1] }))
      .sort((c1, c2) => c2?.value?.lastestMessage?.createdAt - c1?.value?.lastestMessage?.createdAt);
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
    longPressedConversationId.current = conversationId;
    setModalVisibility(true);
  };

  useEffect(() => {
    if (!modalVisibility)
      return;

    const conversationId = longPressedConversationId.current;

    const selectedConversation = listRawConversations?.[conversationId];
    const seenByThisUser = checkConversationSeenByUser(user?.email, selectedConversation);

    if (!selectedConversation)
      return;

    let modalData = [];

    if (selectedConversation.type === "private") {
      const otherUserEmail = getOtherUsersInConversation(user?.email, selectedConversation)?.[0];
      const blockedByThisUser = Object.values(user?.blockedUsers ?? {}).includes(otherUserEmail);

      modalData.push(
        {
          text: (blockedByThisUser ? "Unblock" : "Block") + " this user",
          onPress: () => (blockedByThisUser ? handleUnblockUser : handleBlockUser)(user?.email, otherUserEmail),
        }
      )
    }

    if (selectedConversation.type === "group") {
      if (user?.email === selectedConversation?.owner) {
        modalData.push(
          {
            text: "Delete this conversation",
            onPress: () => handleConfirmAndDeleteConversations(conversationId),
          }
        )
      } else {
        modalData.push(
          {
            text: "Leave this conversation",
            onPress: () => handleConfirmAndLeaveConversation(conversationId, selectedConversation),
          }
        )
      }
    }

    modalData.push(
      {
        text: `Mark as ${(seenByThisUser ? "unread" : "read")}`,
        onPress: () => (seenByThisUser ? handleUnseenByUser : handleSeenByUser)(user?.email, conversationId, selectedConversation),
      }
    )

    setModalContent(convertToModalContent(modalData));
  }, [modalVisibility, listConversations, user]);

  const handleConfirmAndDeleteConversations = (conversationId) => {
    Alert.alert(
      "Delete conversation",
      "Are you sure to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => Fire.remove(`conversation/${conversationId}`),
        },
      ]
    )
  }

  const handleConfirmAndLeaveConversation = (conversationId, conversation) => {
    Alert.alert(
      "Leave conversation",
      "Are you sure to leave this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => handleRemoveMember(user?.email, conversationId, conversation),
        },
      ]
    )
  }

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
    let hour = result.getHours();
    if (hour < 10) hour = "0" + hour.toString();
    let minute = result.getMinutes();
    if (minute < 10) minute = "0" + minute.toString();
    return `${hour}:${minute}`;
  };

  // //LOADING EFFECT
  // const [load, setLoad] = useSate(false);
  // useEffect(() => {
  //   setLoad(true);
  // });

  // if (!load) return <ScreenSplash/>
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
                  marginVertical: 4,
                  backgroundColor: "transparent",
                  height: 48,
                  flex: 5,
                }}
                inputContainerStyle={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 16,
                }}
                leftIconContainerStyle={{ marginLeft: 16 }}
                inputStyle={{}}
                value={searchText}
                onChangeText={setSearchText}
              />
              {/* <TouchableOpacity onPress={handleCreateConversationPress} style={{alignSelf: 'flex-start'}}>
                <Icon.AddCircle style={{ width: 32, height: 32 }} />
              </TouchableOpacity> */}
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
                    name={getConversationDisplayName(user?.email, conversation.value, listRawUsers)}
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

          <ActionButton onPress={handleCreateConversationPress} />
        </ImageBackground>
      </Layout>
    </SafeAreaView>
  );
};

export default ScreenConversations;
