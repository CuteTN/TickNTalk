import React, { useEffect, useState, useRef, useMemo } from "react";
import * as styles from "../shared/styles";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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

const ScreenConversationInfo = ({ route }) => {
  const { user } = useSignedIn();
  const { conversationId } = route?.params ?? {};
  const [conversation] = useRealtimeFire("conversation", conversationId);
  const [avatarLink, updateAvatarLink] = useState("");
  const [isEditName, setEdit] = useState(false);
  const [cName, updateName] = useState("");
  const listRawUsers = useFiredux("user") ?? {};

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
        Fire.set(`conversation/${conversationId}/name/`, cName).then(() => {});
      }
    } else setEdit(true);
  };
  const handleUpdateAvatar = async () => {
    let image = await pickProcess(true);

    let imageName = `Converstation_${conversationId}`;
    let downloadLink = await uploadPhotoAndGetLink(image.uri, imageName);
    Fire.set(`conversation/${conversationId}/avaUrl/`, downloadLink).then(
      () => {}
    );
  };

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
              />
            );
          })}
        </Layout>
      </ScrollView>
    );
  };

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
              }}
            >
              <Text>Members:</Text>
              {renderListMembers()}
            </Layout>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenConversationInfo;
