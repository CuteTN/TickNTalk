import { Layout, Text, CheckBox } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView } from "react-native";
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

export default ScreenCreateConversation = () => {
  const { user } = useSignedIn();
  const rawUsers = useFiredux("user");
  const [searchText, setSearchText] = useState("");

  // object { userId: boolean }
  const [selectedUserEmails, setSelectedUserEmails] = useState({});
  const navigation = useNavigation();

  // pin selected users to top
  // sort searched result
  const [listRenderedUsers, setListRenderedUsers] = useState([]);

  /** list users after making into a list and filtered */
  const listUsers = React.useMemo(() => {
    if (user && rawUsers)
      return Object.entries(rawUsers)
        .map((entry) => ({ key: entry[0], value: entry[1] }))
        .filter(
          (u) =>
            u.value.email !== user.email && checkEnoughUserInfo(u.value).isValid
        );
  }, [user, rawUsers]);

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

  const handleCreateGroup = (listMembers) => {
    listMembers?.sort?.();

    let type = "group";
  };

  const handleToggleSelectedUser = (email) => {
    setSelectedUserEmails((prev) => ({
      ...prev,
      [email]: prev[email] ? false : true,
    }));
  };

  return (
    <SafeAreaView style={SafeView}>
      <TopNavigationBar title="Create Conversation" />
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
      </Layout>
    </SafeAreaView>
  );
};
