import React, { useState, useEffect } from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import {
  ImageBackground,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Fire from "../firebase/Fire";
import { useSignedIn } from "../hooks/useSignedIn";
import { emailToKey } from "../Utils/emailKeyConvert";

import { BasicImage } from "../components/BasicImage";
import { pickProcess, uploadPhotoAndGetLink } from "../Utils/uploadPhotoVideo";
import { useNavigation } from '@react-navigation/native';
import { SafeView, Styles } from '../styles/Styles';


const ScreenEditUserAva = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useSignedIn();

  const [avatarLink, updateAvatarLink] = useState(null); // giá trị mặc định của avatarLink là avatar hiện tại của user (nếu có)

  //#region Upload ảnh từ thiết bị lên app (chưa lưu)

  //Nhấn vào avatar
  const handleAvatarPress = async () => {
    let result = await pickProcess(true);
    updateAvatarLink(result.uri);
  };
  //#endregion

  //#region Upload ảnh từ app lên Storage (lưu)

  //Upload ảnh lên Storage
  const uploadAvatarToFirebase = async (uri) => {
    let downloadURL = await uploadPhotoAndGetLink(uri, user.email);
    Fire.update(`user/${emailToKey(user.email)}`, {
      avaUrl: downloadURL,
    }).then(
      () => {
        Alert.alert(
          "Success",
          "Profile image updated successfully!",
          [{ text: "OK", style: "default", onPress: () => { navigation.goBack() } }],
          { cancelable: false }
        );
      },
      (error) => {
        Alert.alert(
          "Error",
          "Something went wrong",
          [{ text: "OK", style: "cancel" }],
          { cancelable: true }
        );
      }
    );

  }
  // Nhấn vào nút Done
  const handleDonePress = () => {
    if (!avatarLink)
      return;

    Alert.alert(
      "Update profile image",
      "Are you sure?",
      [
        { text: "OK", style: "default", onPress: () => uploadAvatarToFirebase(avatarLink) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };
  //#endregion

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={SafeView}>
          <Layout style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity
              style={{
                borderRadius: 100,
                width: 200,
                height: 200,
                backgroundColor: "pink",
                borderWidth: 1,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleAvatarPress}
            >
              <BasicImage
                icon={200}
                borderRadius={100}
                source={{ uri: avatarLink ?? user?.avaUrl }}
              ></BasicImage>
            </TouchableOpacity>
            <Button onPress={handleDonePress}>DONE</Button>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenEditUserAva;
