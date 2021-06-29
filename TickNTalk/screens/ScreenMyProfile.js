import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { TopNavigationBar } from "../components/TopNavigationBar";
import { useRealtimeFire } from "../hooks/useRealtimeFire";
import { navigateAndReset } from "../Utils/navigation";
import { showMessage } from "react-native-flash-message";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useSignedIn();
  const [tempUser, setTempUser] = useState(null);
  const [editingMode, setEditingMode] = useState(false);

  useEffect(() => {
    if (tempUser && editingMode) return;
    setTempUser(user);
    if (user && !checkEnoughUserInfo(user).isValid) setEditingMode(true);
  }, [user, editingMode]);

  const isSavable = () => checkEnoughUserInfo(tempUser).isValid;

  const handleSignOutPress = () => {
    Fire.signOut().then(({ successful, errorMessage }) => {
      if (successful) {
        navigateAndReset(navigation, SCREENS.signIn.name);
        showMessage({ type: "success", message: `Sign out successfully!` });
      }
      if (errorMessage) {
        showMessage({ type: "danger", message: errorMessage.message });
      }
    });
  };

  const handleUpdateAvatarPress = () => {
    if (editingMode) navigation.navigate(SCREENS.editUserAva.name);
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
        tempUser.avaUrl = "https://firebasestorage.googleapis.com/v0/b/tickntalk2.appspot.com/o/avatar.png?alt=media&token=394b1a98-93f2-4c77-ab68-226fb5f82ce7";
      updateUser(tempUser).then(() => {
        showMessage({
          type: "success",
          message: "Your information has been saved!",
        })
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
                <TouchableOpacity
                  enabled={editingMode}
                  onPress={handleUpdateAvatarPress}
                >
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
                    source={{ uri: user?.avaUrl }}
                  />
                </TouchableOpacity>
                <Input
                  style={Styles.overall}
                  label={"Email"}
                  value={tempUser?.email}
                  editable={false}
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

                  <Input
                    style={{ flex: 2, paddingLeft: 4 }}
                    label={"Gender"}
                    value={tempUser?.gender}
                    onChangeText={setTempUserFieldFunc("gender")}
                  ></Input>
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
                    setTempUserFieldFunc("phoneNumber")(text.replace(" ", ""))
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

                {!editingMode ? (
                  <Layout
                    style={{
                      backgroundColor: "transparent",
                      marginTop: 32,
                      alignItems: "center",
                    }}
                  >
                    <Text> Promise me you will comback UwU</Text>
                    <Button
                      appearance="outline"
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
      </ImageBackground>
    </Layout>
  );
};

export default ScreenMyProfile;
