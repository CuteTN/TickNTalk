import React, { useState, useEffect } from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import {
  ImageBackground,
  SafeAreaView,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import Fire from "../firebase/Fire";
import { useSignedIn } from "../hooks/useSignedIn";
import { emailToKey } from "../Utils/emailKeyConvert";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { BasicImage } from "../components/BasicImage";
import {SafeView, Styles} from '../styles/Styles';

const ScreenEditUserAva = () => {
  const { user, updateUser } = useSignedIn();

  const [avatarLink, updateAvatarLink] = useState(null); // giá trị mặc định của avatarLink là avatar hiện tại của user (nếu có)

  //#region Upload ảnh từ thiết bị lên app (chưa lưu)

  //Lấy quyền truy cập camera
  const getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      return status;
    }
  };

  //Lấy ảnh từ thư viện ảnh của thiết bị
  const pickImage = async () => {
    try {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // loại media nào được chọn, ở đây là Images, nếu chỉnh sang All, có thể chọn đuọc cả video
        allowsEditing: true, //trong quá trình chọn, có thể chọn ảnh khác.
        aspect: [1, 1], // 1:1 là ảnh vuông, 16:9 ,...
        quality: 0.75, // chất lượng ảnh
        //Một vài properties nữa mà thấy như này đủ rồi.
      }).then((result) => {
        // kết quả trả về bao gồm
        //   "cancelled": có bị hủy k
        //   "height": chiều dài,
        //   "type": image hay video
        //   "uri": link ảnh (dạng local vd: file/Disk_C/...)
        //   "width": chiều ngang,
        if (!result.cancelled) {
          updateAvatarLink(result.uri); // not async
        }
      });
    } catch (error) {
      Alert.alert(
        "Thông báo",
        "Đã có lỗi xảy ra trong lúc chọn ảnh",
        [{ text: "Đồng ý", style: "cancel" }],
        { cancelable: true }
      );
    }
  };

  //Nhấn vào avatar
  const handleAvatarPress = async () => {
    getPermissions().then((status) => {
      if (status !== "granted") {
        // Nếu người dùng không cấp quyền truy cập ảnh.
        alert("We need permissions to get access to your camera library");
        return;
      }
      pickImage();
    });
  };
  //#endregion

  //#region Upload ảnh từ app lên Storage (lưu)

  //Lấy Blob, đây là workFlow của tutorial (Thảo)
  const getBlob = async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError("Network request fails"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  //Upload ảnh lên Storage
  const uploadProfilePhoto = async (uri) => {
    try {
      getBlob(uri).then((photo) => {
        const uploadUri = user.email;

        const imageRef = Fire.subscribeStorage().child(uploadUri);

        imageRef.put(photo);
        imageRef.getDownloadURL().then((downloadURL) => {
          Fire.update(`user/${emailToKey(user.email)}`, {
            avaUrl: downloadURL,
          }).then(
            () => {
              Alert.alert(
                "Thông báo",
                "Đã cập nhật ảnh đại diện thành công",
                [{ text: "Đồng ý", style: "cancel" }],
                { cancelable: true }
              );
            },
            (error) => {
              Alert.alert(
                "Thông báo",
                "Đã có lỗi xảy ra trong lúc lưu ảnh",
                [{ text: "Đồng ý", style: "cancel" }],
                { cancelable: true }
              );
            }
          );
        });
      });
    } catch (error) {
      alert("Đã có lỗi xảy ra trong quá trình upload ảnh");
    }
  };

  // Nhấn vào nút Done
  const handleDonePress = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn cập nhật ảnh đại diện",
      [
        { text: "Đồng ý", onPress: () => uploadProfilePhoto(avatarLink) },
        { text: "Hủy", style: "cancel" },
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
