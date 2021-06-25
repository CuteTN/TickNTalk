import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";
import Fire from "../firebase/Fire";
//#region Upload ảnh từ thiết bị lên app (chưa lưu)

//Lấy quyền truy cập camera
export const getPermissions = async () => {
  if (Platform.OS !== "web") {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    return status;
  }
};
export const getVoice = async () => {
  if (Platform.OS !== "web") {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    return status;
  }
};
//Lấy ảnh từ thư viện ảnh của thiết bị
export const pickImage = async (imageOnly) => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: imageOnly
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.All, // loại media nào được chọn, ở đây là Images, nếu chỉnh sang All, có thể chọn đuọc cả video
      allowsEditing: true, //trong quá trình chọn, có thể chọn ảnh khác.
      aspect: imageOnly ? [1, 1] : [16, 9], // 1:1 là ảnh vuông, 16:9 ,...
      quality: 0.75, // chất lượng ảnh
      //Một vài properties nữa mà thấy như này đủ rồi.
    });
    if (!result.cancelled) {
      return result; // not async
    }
  } catch (error) {
    Alert.alert(
      "Thông báo",
      "Đã có lỗi xảy ra trong lúc chọn ảnh",
      [{ text: "Đồng ý", style: "cancel" }],
      { cancelable: true }
    );
  }
};
export const pickProcess = async (imageOnly) => {
  let status = await getPermissions();
  if (status !== "granted") {
    // Nếu người dùng không cấp quyền truy cập ảnh.
    alert("We need permissions to get access to your camera library");
    return;
  }
  return await pickImage(imageOnly);
};

//#endregion
//#region Upload ảnh từ app lên Storage (lưu)

//Lấy Blob, đây là workFlow của tutorial (Thảo)
export const getBlob = async (uri) => {
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
export const uploadPhotoAndGetLink = async (uri, fileName) => {
  try {
    let photo = await getBlob(uri);
    const imageRef = Fire.subscribeStorage().child(fileName);
    await imageRef.put(photo);
    let result = await imageRef.getDownloadURL();
    return result;
  } catch (error) {
    alert("An error occurred while uploading media");
  }
};
export const uploadAudiotoFirebase = async (uri, fileName) => {
  try {
    //console.log(uri);
    let audio = await getBlob(uri);
    if (audio) {
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      //console.log(audio);
      var metadata = {
        contentType: `audio/${fileType}`,
      };
      const audioRef = Fire.subscribeStorage().child(`${fileName}.${fileType}`);

      await audioRef.put(audio, metadata);
      let result = await audioRef.getDownloadURL();
      return result;
    }
  } catch (error) {
    alert("An error occurred while uploading media");
  }
};

//#endregion
