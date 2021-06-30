import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Layout, Text, Button, Input, Avatar } from "@ui-kitten/components";
import Fire from "../firebase/Fire";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";
import { ImageBackground, SafeAreaView } from "react-native";
import { SCREENS } from ".";
import { showMessage } from "react-native-flash-message";

const ScreenEditUserPassword = () => {
  const navigation = useNavigation();
  const [oldPassword, updateOldPassword] = useState(null);
  const [renewPassword, updateRenewPassword] = useState(null);
  const [newPassword, updateNewPassword] = useState(null);
  const handleDonePress = async () => {
    if (!oldPassword || !newPassword || !renewPassword) {
      showMessage({
        type: "danger",
        message: `None can't be empty`,
      });
      return;
    }
    if (oldPassword === newPassword) {
      showMessage({
        type: "danger",
        message: `New password can't be Old password`,
      });
      return;
    }
    Fire.checkInputPasswordMatched(oldPassword).then(
      () => {
        if (newPassword === renewPassword) {
          let user = Fire.getCurrentUser();
          user.updatePassword(newPassword).then(
            () => {
              showMessage({
                type: "success",
                message: `Update password successfully`,
              });
              navigation.goBack();
            },
            (error) => {
              showMessage({
                type: "danger",
                message: `Fail to update password`,
              });
            }
          );
        } else {
          showMessage({
            type: "danger",
            message: `confirm password mismatch`,
          });
        }
      },
      (error) => {
        showMessage({
          type: "danger",
          message: `Old password mismatch`,
        });
      }
    );
  };
  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <Layout style={[styles.center, { opacity: 0.85 }]}>
          <Input
            label={"Current password"}
            style={Styles.overall}
            placeholder={"old password"}
            secureTextEntry={true}
            onChangeText={updateOldPassword}
          />
          <Input
            label={"New password"}
            style={Styles.overall}
            placeholder={"new password"}
            secureTextEntry={true}
            onChangeText={updateNewPassword}
          />
          <Input
            label={"Confirm password "}
            style={Styles.overall}
            placeholder={"confirm password"}
            secureTextEntry={true}
            onChangeText={updateRenewPassword}
          />
          <Button
            onPress={handleDonePress}
            style={[Styles.overall, Styles.button]}
          >
            DONE
          </Button>

          <Layout
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text style={[{ textAlignVertical: "center" }, Styles.overall]}>
              Update your password
            </Text>
          </Layout>
        </Layout>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenEditUserPassword;
