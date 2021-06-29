import { Layout, Text, CheckBox, Button } from "@ui-kitten/components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, SafeAreaView, ScrollView, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import * as styles from "../shared/styles";
import Icon from "react-native-vector-icons/Ionicons";
import { MessageCard } from "../components/MessageCard";
import { useFiredux } from "../hooks/useFiredux";
import { useSignedIn } from "../hooks/useSignedIn";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";
import { TopNavigationBar } from "../components/TopNavigationBar";
import { showMessage } from "react-native-flash-message";
import Fire from "../firebase/Fire";
import { emailToKey } from "../Utils/emailKeyConvert";
import { useNavigation } from "@react-navigation/native";
import { matchPointUser } from "../Utils/search";
import { SCREENS } from ".";
import { SafeView, windowWidth } from "../styles/Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { checkBlockedByUser, handleBlockUser, handleUnblockUser } from "../Utils/user";

import {
  BottomModal,
  ModalContent,
  ModalButton,
  SlideAnimation,
} from "react-native-modals";
import { useRealtimeFire } from "../hooks/useRealtimeFire";

export default ScreenCreateConversation = ({ route }) => {
  const { user } = useSignedIn();

  const { editingConversationId } = route?.params ?? {};
  const [editingConversation] = useRealtimeFire("conversation", editingConversationId);
  const isEditingMode = useMemo(() => Boolean(editingConversation));
  const editingConversationMembers = useMemo(() => {
    if (!editingConversation)
      return [];

    return Object.values(editingConversation?.listMembers ?? {});
  }, [editingConversation])

  const rawUsers = useFiredux("user");
  const [searchText, setSearchText] = useState("");

  const [modalVisibility, setModalVisibility] = useState(false);
  const longPressedUserEmail = useRef("");

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
    // console.log(newData);
    return (
      <ModalContent>
        <FlatList data={newData} renderItem={renderItem} />
      </ModalContent>
    );
  }

  const handleUserLongPress = (email) => {
    longPressedUserEmail.current = email;
    setModalVisibility(true);
  };

  useEffect(() => {
    if (!modalVisibility)
      return;

    const email = longPressedUserEmail.current;

    const selectedUser = rawUsers?.[emailToKey(email)];
    const blockedByThisUser = Object.values(user?.blockedUsers ?? {}).includes(email);

    if (!selectedUser)
      return [];

    let modalData = [];

    modalData.push(
      {
        text: (blockedByThisUser ? "Unblock" : "Block") + " this user",
        onPress: () => (blockedByThisUser ? handleUnblockUser : handleBlockUser)(user?.email, email),
      }
    )

    setModalContent(convertToModalContent(modalData));
  }, [modalVisibility, rawUsers, user]);

  // object { userId: boolean }
  const [selectedUserEmails, setSelectedUserEmails] = useState({});
  const navigation = useNavigation();

  // pin selected users to top
  // sort searched result
  const [listRenderedUsers, setListRenderedUsers] = useState([]);

  /** list users after making into a list and filtered */
  const listUsers = React.useMemo(() => {
    if (user && rawUsers)
      if (!(isEditingMode && (!editingConversationMembers)))
        return Object.entries(rawUsers)
          .map((entry) => ({ key: entry[0], value: entry[1] }))
          .filter(
            (u) =>
              u.value.email !== user.email && checkEnoughUserInfo(u.value).isValid
          )
          .filter(
            (u) =>
              !checkBlockedByUser(u.value, user?.email)
          )
          .filter(
            (u) => {
              if (isEditingMode) {
                return !editingConversationMembers.includes(u.value?.email);
              } else
                return true;
            }
          );
  }, [user, rawUsers, isEditingMode, editingConversationMembers]);

  useEffect(() => {
    if (listUsers && selectedUserEmails) {
      let newRenderedList = [];

      listUsers.forEach((c) => {
        const matchPoint = matchPointUser(searchText, c.value);
        const selected = Boolean(selectedUserEmails[c.value?.email]);

        if (!(searchText && matchPoint <= 0 && !selected))
          newRenderedList.push({
            ...c,
            matchPoint,
            selected,
          });
      });

      newRenderedList.sort((c1, c2) =>
        c1.selected - c2.selected
          ? c2.selected - c1.selected
          : c2.matchPoint - c1.matchPoint
      );

      setListRenderedUsers(newRenderedList);
    }
  }, [searchText, listUsers, selectedUserEmails]);

  const handleCreateConversationPress = () => {
    const listMembers = Object.keys(selectedUserEmails).filter(
      (uEmail) => selectedUserEmails[uEmail]
    );
    listMembers.push(user.email);

    if (isEditingMode) {
      editingConversationMembers.forEach(
        email => listMembers.push(email)
      )
      handleUpdateEditingConversationMembers(listMembers);
      return;
    }
    if (listMembers.length <= 1) {
      showMessage({
        type: "danger",
        message: "Please select at least 1 member to join your conversation.",
      });
      return;
    }
    if (listMembers.length === 2) {
      // showMessage({ type: "success", message: })
      Alert.alert(
        "Create conversation",
        "Do you want to chat in private message instead?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => { },
          },
          {
            text: "No",
            style: "default",
            onPress: () => createNewConversation(listMembers, "group"),
          },
          {
            text: "Yes",
            style: "default",
            onPress: () => createNewConversation(listMembers, "private"),
          },
        ]
      );
    } else {
      Alert.alert(
        "Create conversation",
        "Do you want to create a conversation with these users?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => { },
          },
          {
            text: "Yes",
            style: "default",
            onPress: () => createNewConversation(listMembers, "group"),
          },
        ]
      );
    }
  };

  const handleUpdateEditingConversationMembers = (listMembers) => {
    listMembers = [...new Set(listMembers)];
    listMembers.sort((a, b) => a.localeCompare(b));

    Fire.update(`conversation/${editingConversationId}`, { listMembers }).then(() => {
      navigation.replace(SCREENS.message.name, { conversationId: editingConversationId });
      showMessage({
        message: "Conversation's members updated!",
        type: "success",
      })
    })
  }

  /**
   * @param {[string]} listMembers
   * @param {"private"|"group"} type
   */
  const createNewConversation = (listMembers, type) => {
    if (listMembers.length !== 2 && type === "private") return;

    listMembers.sort((a, b) => a.localeCompare(b));

    switch (type) {
      case "private": {
        const key = `${emailToKey(listMembers[0])}~${emailToKey(
          listMembers[1]
        )}`;

        Fire.update(`conversation/${key}`, { listMembers, type }).then(() => {
          navigation.replace(SCREENS.message.name, { conversationId: key });
        });

        break;
      }

      case "group": {
        let name = `${user.displayName}'s new group`;
        Fire.push(`conversation`, { listMembers, type, name, owner: user.email }).then((res) => {
          const { key } = res ?? {};

          if (key)
            navigation.replace(SCREENS.message.name, { conversationId: key });
        });

        break;
      }
    }
  };

  const handleToggleSelectedUser = (email) => {
    if (!checkBlockedByUser(user, email)) {
      setSelectedUserEmails((prev) => ({
        ...prev,
        [email]: prev[email] ? false : true,
      }));
    } else {
      showMessage({
        message: "You blocked this user.",
        type: "danger",
      })
    }
  };

  return (
    <SafeAreaView style={SafeView}>
      <TopNavigationBar title={isEditingMode ? "Add members" : "Create conversation"} />
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
              placeholder="Search for users"
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

            <Icon
              name={"people-circle-outline"}
              size={50}
              style={{ flex: 1 }}
              onPress={handleCreateConversationPress}
            />
          </Layout>
          {/*  Binding message list */}
          <ScrollView>
            {listRenderedUsers?.map((user) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "100%"
                }}
                onPress={() => handleToggleSelectedUser(user?.value?.email)}
                onLongPress={() => handleUserLongPress(user?.value?.email)}
              >
                <CheckBox
                  style={{ flex: 1, marginLeft: 30 }}
                  status="primary"
                  checked={user?.selected}
                ></CheckBox>
                <MessageCard
                  containerStyle={{ flex: 9 }}
                  name={`${user?.value?.firstName} ${user?.value?.lastName}`}
                  lastestChat={`${user?.value?.displayName}`}
                  ImageSize={60}
                  imageSource={user?.value?.avaUrl ?? "../assets/bg.png"}
                  isRead={!user?.selected}
                // highlight selection
                />
              </TouchableOpacity>
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
      </Layout>
    </SafeAreaView>
  );
};
