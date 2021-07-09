import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Text,
  Button,
  Input,
  Avatar,
  Select,
  SelectItem,
  Datepicker,
  Divider,
  Alert,
  IndexPath,
} from "@ui-kitten/components";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import * as styles from "../shared/styles";
import { Styles, SafeView } from "../styles/Styles";
import { SCREENS } from ".";
import {
  ImageBackground,
  Image,
  Keyboard,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { TopNavigationBar } from "../components/TopNavigationBar";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { navigateAndReset } from "../Utils/navigation";
import { showMessage } from "react-native-flash-message";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";
import {
  BottomModal,
  ModalContent,
  ModalButton,
  SlideAnimation,
} from "react-native-modals";
import { pickProcess, uploadPhotoAndGetLink } from "../Utils/uploadPhotoVideo";
import { emailToKey, tokenToKey } from "../Utils/emailKeyConvert";
import { replaceAll } from "../Utils/stringUtils";

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user, updateUser, token } = useSignedIn();
  const [tempUser, setTempUser] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [avatarLink, updateAvatarLink] = useState(null);

  const GENDERS = ["Male", "Female", "Other"];
  const [genderSelectedIndex, setGenderSelectedIndex] = useState();
  const currentGender = useMemo(() => GENDERS[genderSelectedIndex - 1]);

  const isNewUser = React.useRef(undefined);

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
          [{ text: "OK", style: "default" }],
          { cancelable: false }
        );
      },
      (error) => {
        updateAvatarLink(user.avaUrl);
        Alert.alert(
          "Error",
          "Something went wrong",
          [{ text: "OK", style: "cancel" }],
          { cancelable: true }
        );
      }
    );
  };
  // Nhấn vào nút update
  const handleUpdate = async () => {
    setModalVisibility(false);
    let result = await pickProcess(true);
    // console.log(result);
    updateAvatarLink(result.uri);
    await uploadAvatarToFirebase(result.uri);
  };
  //#endregion

  useEffect(() => {
    if (!user) return;
    updateAvatarLink(user?.avaUrl);
  }, [user]);


  useEffect(() => {
    if (tempUser && editingMode) return;

    if (user && isNewUser.current === undefined)
      isNewUser.current = !checkEnoughUserInfo(user).isValid;

    setTempUser(user);

    const initGenderIndex = GENDERS.findIndex(g => g === user?.gender);
    setGenderSelectedIndex(initGenderIndex >= 0 ? new IndexPath(initGenderIndex) : null);

    if (user && !checkEnoughUserInfo(user).isValid) setEditingMode(true);
  }, [user, editingMode]);


  function convertToModalContent(newData) {
    //newData is an array contains of [{title, function}]
    const renderItem = ({ item }) => (
      <Button appearance="ghost" onPress={item.onPress}>
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

  useEffect(() => {
    if (!modalVisibility) return;
    let modalData = [];
    modalData.push({
      text: `Update your avatar`,
      onPress: () => handleUpdate(),
    });

    setModalContent(convertToModalContent(modalData));
  }, [modalVisibility]);

  const isSavable = () => checkEnoughUserInfo(tempUser).isValid;

  const handleSignOutPress = async () => {
    await Fire.remove(
      `user/${emailToKey(user.email)}/tokens/${tokenToKey(token)}`
    );
    await Fire.signOut().then(({ successful, errorMessage }) => {
      if (successful) {
        navigateAndReset(navigation, SCREENS.signIn.name);
        showMessage({ type: "success", message: `Sign out successfully!` });
      }
      if (errorMessage) {
        showMessage({ type: "danger", message: errorMessage.message });
      }
    });
  };

  const handleChangePassword = () => {
    navigation.navigate(SCREENS.editUserPassword.name);
  }
  const handleUpdateAvatarPress = () => {
    //if (editingMode) navigation.navigate(SCREENS.editUserAva.name);
    setModalVisibility(true);
  };

  const rowStyle = {
    ...Styles.overall,
    ...Styles.row,
  };

  const handleEditProfilePress = () => {
    setEditingMode(true);
  };

  const handleSaveChangesPress = () => {
    if (isSavable()) {
      setEditingMode(false);
      if (!tempUser.avaUrl)
        tempUser.avaUrl =
          "https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/avatar.png?alt=media&token=394b1a98-93f2-4c77-ab68-226fb5f82ce7";
      updateUser(tempUser).then(() => {
        showMessage({
          type: "success",
          message: "Your information has been saved!",
        });
        if (isNewUser.current)
          navigation.replace(SCREENS.master.name);
      });
    } else {
      showMessage({
        type: "danger",
        message: checkEnoughUserInfo(tempUser).message,
      });
    }
  };

  const setTempUserFieldFunc = (field) => (value) => {
    setTempUser((prev) => ({ ...prev, [field]: value }));

    if (!editingMode) setEditingMode(true);
  };

  const displayPhoneNumber = (number) =>
    `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(
      6,
      10
    )}`.trim();


  const handleSelectGenderIndex = (newIndex) => {
    setGenderSelectedIndex(newIndex);
    setTempUserFieldFunc("gender")(GENDERS[newIndex - 1]);
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
        imageStyle={{ opacity: 0.6 }}
      >
        <SafeAreaView
          style={[
            SafeView,
            { flex: 1, backgroundColor: "transparent", marginBottom: 16 },
          ]}
        >
          <TopNavigationBar title="About me" navigation={navigation} />
          <Layout style={{ backgroundColor: "transparent", flex: 1 }}>
            <ScrollView style={{ backgroundColor: "transparent" }}>
              <Layout
                style={([styles.center], { backgroundColor: "transparent" })}
              >
                <TouchableOpacity onPress={handleUpdateAvatarPress}>
                  <Avatar
                    style={[
                      Styles.overall,
                      {
                        height: 192,
                        width: 192,
                        marginTop: 16,
                        alignSelf: "center",
                      },
                    ]}
                    size="large"
                    shape="round"
                    source={{ uri: avatarLink }}
                  />
                </TouchableOpacity>
                <Input
                  style={Styles.overall}
                  label={"Email"}
                  value={tempUser?.email}
                  disabled={true}
                />

                <Layout style={rowStyle}>
                  <Input
                    style={{ flex: 3, paddingRight: 4 }}
                    label={"First name"}
                    value={tempUser?.firstName}
                    onChangeText={setTempUserFieldFunc("firstName")}
                  />

                  <Input
                    style={{ flex: 2, paddingLeft: 4 }}
                    label={"Last name"}
                    value={tempUser?.lastName}
                    onChangeText={setTempUserFieldFunc("lastName")}
                  />
                </Layout>

                <Layout style={rowStyle}>
                  <Input
                    style={{ flex: 1 }}
                    label={"Display name"}
                    value={tempUser?.displayName}
                    onChangeText={setTempUserFieldFunc("displayName")}
                  />
                </Layout>

                <Layout style={rowStyle}>
                  <Datepicker
                    min={new Date(1900, 1, 1)}
                    max={new Date(Date.now())}
                    style={{ flex: 3, paddingRight: 4 }}
                    label={"Birthday"}
                    placeholder={"Birthday"}
                    date={
                      tempUser?.birthday ? new Date(tempUser?.birthday) : null
                    } // edit later :)
                    onSelect={setTempUserFieldFunc("birthday")}
                  />

                  {/* <Input
                    style={{ flex: 2, paddingLeft: 4 }}
                    label={"Gender"}
                    value={tempUser?.gender}
                    onChangeText={setTempUserFieldFunc("gender")}
                  ></Input> */}

                  <Select
                    label={"Gender"}
                    style={{ flex: 2, paddingLeft: 4 }}
                    placeholder={"Gender"}
                    value={currentGender}
                    selectedIndex={genderSelectedIndex}
                    onSelect={handleSelectGenderIndex}
                  >
                    {GENDERS.map(g => <SelectItem title={g} />)}
                  </Select>

                </Layout>

                <Layout style={rowStyle}>
                  <Input
                    style={{ flex: 1 }}
                    label={"Country"}
                    value={tempUser?.country}
                    onChangeText={setTempUserFieldFunc("country")}
                  />
                </Layout>

                <Input
                  style={Styles.overall}
                  label={"Phone number"}
                  keyboardType={"phone-pad"}
                  value={
                    editingMode
                      ? tempUser?.phoneNumber
                      : displayPhoneNumber(tempUser?.phoneNumber ?? "")
                  }
                  onChangeText={(text) =>
                    setTempUserFieldFunc("phoneNumber")(replaceAll(text, " ", ""))
                  }
                />

                {!editingMode ? (
                  <Button
                    style={[Styles.overall, Styles.button, { width: "auto" }]}
                    onPress={handleEditProfilePress}
                  >
                    EDIT YOUR PROFILE
                  </Button>
                ) : (
                  <Button
                    style={[Styles.overall, Styles.button, { width: "auto" }]}
                    onPress={handleSaveChangesPress}
                  >
                    SAVE CHANGES
                  </Button>
                )}

                {!isNewUser.current &&
                  <Button
                    appearance="outline"
                    style={[Styles.overall, Styles.button, { width: "auto" }]}
                    onPress={handleChangePassword}
                  >
                    CHANGE YOUR PASSWORD
                  </Button>
                }

                {!editingMode ? (
                  <Layout
                    style={{
                      backgroundColor: "transparent",
                      marginTop: 32,
                      alignItems: "center",
                    }}
                  >
                    <Text>Sign in with another account</Text>
                    <Button
                      style={[Styles.overall, Styles.button, { width: "auto" }]}
                      onPress={handleSignOutPress}
                    >
                      SIGN OUT
                    </Button>
                  </Layout>
                ) : null}
              </Layout>
            </ScrollView>
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

export default ScreenMyProfile;
