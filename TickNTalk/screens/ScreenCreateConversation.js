import { Layout, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import * as styles from "../shared/styles";
import Icon from "react-native-vector-icons/Ionicons";
import { MessageCard } from "../components/MessageCard";
import { useFiredux } from "../hooks/useFiredux";
import { useSignedIn } from "../hooks/useSignedIn";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";
import { showMessage } from "react-native-flash-message";
import Fire from "../firebase/Fire";
import { emailToKey } from "../Utils/emailKeyConvert";
import { useNavigation } from "@react-navigation/native";
import { navigateAndReset } from "../Utils/navigation";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import {SafeView, Styles} from '../styles/Styles';

export default ScreenCreateConversation = () => {
  const { user } = useSignedIn();
  const rawUsers = useFiredux("user");

  const [listUsers, setListUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (user && rawUsers) {
      setListUsers(
        Object.values(rawUsers).filter(
          (u) => u.email !== user.email && checkEnoughUserInfo(u).isValid
        )
      );
    }
  }, [user, rawUsers]);

  const handleCreateConversationPress = () => {
    const listMembers = Object.keys(selectedUsers).filter(
      (uEmail) => selectedUsers[uEmail]
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
        "Private message",
        "Do you want to chat in private message instead?",
        [
          {
            text: "Yes",
            style: "default",
            onPress: () => handleCreatePrivateMessage(listMembers),
          },
        ]
      );
    }
  };

  /**
   * @param {[]} listMembers
   */
  const handleCreatePrivateMessage = (listMembers) => {
    if (listMembers.length !== 2) return;

    if (listMembers[0].localeCompare(listMembers[1]) === 1)
      listMembers.reverse();
    let type = "private";
    const key = `${emailToKey(listMembers[0])}~${emailToKey(listMembers[1])}`;
    Fire.update(`conversation/${key}`, { listMembers }).then(() => {
      Fire.update(`conversation/${key}/`, { type }).then(() => {
        navigation.goBack();
      });
    });
  };

  const handleToggleSelectedUser = (email) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [email]: prev[email] ? false : true,
    }));
  };

  return (
    <Layout style={{ flex: 1 }}>
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
                // onChangeText={(Text) => {
                //   this.setState({ toSearchText: Text });
                //   this.onChangeSearchText(Text);
                // }}
                // value={this.state.toSearchText}
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
              {listUsers.map((user) => (
                <MessageCard
                  onPress={() => handleToggleSelectedUser(user.email)}
                  name={`${user.firstName} ${user.lastName}`}
                  lastestChat={`${user.displayName}`}
                  imageSource={user.avaUrl ?? "../assets/bg.png"}
                  isRead={!selectedUsers[user.email]} // highlight selection
                />
              ))}
            </ScrollView>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
