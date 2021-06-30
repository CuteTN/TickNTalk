import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Layout, Text, Button, Input, Avatar } from "@ui-kitten/components";
import Fire from "../firebase/Fire";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";
import { ImageBackground, SafeAreaView } from "react-native";
import { SCREENS } from ".";
import { showMessage } from "react-native-flash-message";

const ScreenResetPassword = () => {
  const navigation = useNavigation();
  const [doneVisibility, updateDoneVisibility] = useState(true);
  const [email, setEmail] = useState(null);
  const handleDonePress = async () => {
    if (!email) {
      showMessage({
        type: "danger",
        message: `This field cannot be empty`,
      });
      return;
    }
    if (doneVisibility) {
      updateDoneVisibility(false);
    } else updateDoneVisibility(true);
    const { successful, errorMessage } = await Fire.resetPassword(email);
    if (successful) {
      showMessage({
        type: "success",
        message: `Please check ${email} for new password`,
      });
      navigation.goBack();
    } else {
      showMessage({ type: "error", message: errorMessage });
    }
  };
  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <Layout style={[styles.center, { opacity: 0.85 }]}>
          <Input
            label={"Enter your email to get new password"}
            style={Styles.overall}
            placeholder={"Email"}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <Button
            onPress={handleDonePress}
            style={[Styles.overall, Styles.button]}
          >
            {doneVisibility ? "Done" : "Try again"}
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
              Send new password to this email
            </Text>
          </Layout>
        </Layout>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenResetPassword;
