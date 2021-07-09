import React, { useEffect, useState, useRef, useMemo } from "react";
import * as styles from "../shared/styles";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import { Layout, Text, Button, Input, Card } from "@ui-kitten/components";
import { BasicImage } from "../components/BasicImage";
import { pickProcess, uploadPhotoAndGetLink } from "../Utils/uploadPhotoVideo";
import { Ionicons } from "@expo/vector-icons";
import { Styles } from "../styles/Styles";
import { emailToKey } from "../Utils/emailKeyConvert";
import { useFiredux } from "../hooks/useFiredux";
import { MessageCard } from "../components/MessageCard";
import { useNavigation } from "@react-navigation/native";

import {
  BottomModal,
  ModalContent,
  ModalButton,
  SlideAnimation,
} from "react-native-modals";
import { handleRemoveMember } from "../Utils/conversation";
import { handleBlockUser, handleUnblockUser } from "../Utils/user";
import { SCREENS } from ".";

const ScreenConversationInfo = ({ route }) => {
  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [conversation] = useRealtimeFire("conversation", conversationId);
  const [avatarLink, updateAvatarLink] = useState("");
  const [isEditName, setEdit] = useState(false);
  const [cName, updateName] = useState("");
  const listRawUsers = useFiredux("user") ?? {};
  const navigation = useNavigation();

  useEffect(() => {
    updateName(conversation?.name);
    updateAvatarLink(conversation?.avaUrl);
  }, [conversation]);

  const listMembers = useMemo(() => {
    if (conversation && listRawUsers) {
      const result = [];
      Object.values(conversation?.listMembers).forEach((email) => {
        const member = listRawUsers[emailToKey(email)];
        if (member) result.push(member);
      });

      return result;
    }

    return [];
  }, [conversation, listRawUsers]);

  const handleUpdateName = async () => {
    if (isEditName) {
      if (!cName) alert("Please enter a name");
      else {
        setEdit(false);
        Fire.set(`conversation/${conversationId}/name/`, cName).then(() => { });
      }
    } else setEdit(true);
  };
  const handleUpdateAvatar = async () => {
    let image = await pickProcess(true);

    let imageName = `Converstation_${conversationId}`;
    let downloadLink = await uploadPhotoAndGetLink(image.uri, imageName);
    Fire.set(`conversation/${conversationId}/avaUrl/`, downloadLink).then(
      () => { }
    );
  };


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

    const selectedEmail = longPressedUserEmail.current;

    const selectedUser = listRawUsers?.[emailToKey(selectedEmail)];
    const blockedByThisUser = Object.values(user?.blockedUsers ?? {}).includes(selectedEmail);

    if (!selectedUser)
      return;

    let modalData = [];

    if (selectedEmail !== user.email) {
      modalData.push(
        {
          text: (blockedByThisUser ? "Unblock" : "Block") + " this user",
          onPress: () => (blockedByThisUser ? handleUnblockUser : handleBlockUser)(user?.email, selectedEmail),
        }
      )
    }

    if (conversation.type === "group") {
      if (user?.email !== selectedEmail)
        if (user?.email === conversation.owner) {
          modalData.push(
            {
              text: "Set as group owner",
              onPress: () => handleConfirmSetToGroupOwner(selectedEmail),
            }
          );

          modalData.push(
            {
              text: "Remove this member",
              onPress: () => handleConfirmAndRemoveMember(selectedEmail),
            }
          )

        } else {

        }
    }

    setModalContent(convertToModalContent(modalData));
  }, [modalVisibility, listRawUsers, user]);

  const handleConfirmSetToGroupOwner = (email) => {
    Alert.alert(
      "Set new group owner",
      "By doing this, you will no longer be this group owner.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => {
            if (listMembers.includes)
              Fire.update(`conversation/${conversationId}`, { owner: email })
          },
        },
      ]
    )
  }

  const handleConfirmAndRemoveMember = (email) => {
    Alert.alert(
      "Remove member",
      "Are you sure to remove this member from the group?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => handleRemoveMember(email, conversationId, conversation),
        },
      ]
    )
  }

  const renderListMembers = () => {
    return (
      <ScrollView>
        <Layout style={{ flex: 1 }}>
          {listMembers?.map((member) => {
            return (
              <MessageCard
                containerStyle={{ flex: 9, justifyContent: "flex-start" }}
                name={`${member?.firstName} ${member?.lastName} (${member.displayName})`}
                lastestChat={
                  member?.email === conversation.owner ? "Owner" : "Member"
                }
                ImageSize={60}
                imageSource={member?.avaUrl ?? "../assets/bg.png"}
                isRead={member?.email !== conversation.owner}
                onLongPress={() => handleUserLongPress(member?.email)}
              />
            );
          })}
        </Layout>
      </ScrollView>
    );
  };

  const canAddMembers = useMemo(() => {
    return conversation && user &&
      (conversation?.type === "group") && (conversation?.owner === user?.email)
  }, [user, conversation])

  const handleAddMembersPress = () => {
    navigation.navigate(SCREENS.createConversation.name, { editingConversationId: conversationId })
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Layout
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Input
              key={"nameInput_" + isEditName}
              status={isEditName ? "primary" : "basic"}
              style={Styles.overall}
              label={"Conversation Name"}
              value={cName}
              disabled={!isEditName}
              onChangeText={(text) => {
                updateName(text);
              }}
            />
            <Layout
              style={{
                borderRadius: 100,
                width: 200,
                height: 200,
                backgroundColor: "whitesmoke",
                borderWidth: 1,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            //onPress={handleAvatarPress}
            >
              <BasicImage
                icon={200}
                borderRadius={100}
                source={{ uri: avatarLink }}
              ></BasicImage>
            </Layout>
            <Layout
              style={{
                width: "60%",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              }}
            >
              <Button disabled={isEditName} onPress={handleUpdateAvatar}>
                <Ionicons name="image" size={24} color="black" />
              </Button>
              <Button onPress={() => handleUpdateName()}>
                {isEditName ? (
                  <Ionicons name="checkmark" size={24} color="black" />
                ) : (
                  <Ionicons name="pencil" size={24} color="black" />
                )}
              </Button>
            </Layout>
            <Layout
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 20,
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Text>Members:</Text>
              {canAddMembers &&
                <Button disabled={isEditName} onPress={handleAddMembersPress}>
                  Add members
                </Button>
              }
              {renderListMembers()}
            </Layout>
          </Layout>

        </SafeAreaView>
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
  );
};

export default ScreenConversationInfo;
