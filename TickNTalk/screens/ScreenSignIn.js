import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Layout, Text, Button, Input, Avatar } from "@ui-kitten/components";
import Fire from "../firebase/Fire";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";
import { ImageBackground, SafeAreaView } from "react-native";
import { SCREENS } from ".";

export default ScreenSignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();

  const handleSignInPress = () => {
    Fire.signInWithEmail(email, password).then(
      (isSuccess) => {
        if (isSuccess) {
          navigation.navigate(SCREENS.master.name);
        }
      }
    );
  };

  const handleSignUpPress = () => {
    navigation.navigate(SCREENS.signUp.name);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/bg.png')}
        style={{ flex: 1, resizeMode: "cover" }}
      >

        <Layout style={[styles.center, { opacity: 0.85 }]}>
          <Avatar style={[Styles.overall, { height: 192, width: 192 }]}
            size='large'
            shape='square'
            source={require('../assets/Logo.png')}
          />

          <Input
            style={Styles.overall}
            placeholder={"Email"}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Input
            style={Styles.overall}
            placeholder={"Password"}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Button onPress={handleSignInPress}
            style={[Styles.overall, Styles.button]}>
            SIGN IN
          </Button>

          <Layout style={{ flexDirection: 'row', backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'center' }}>
            <Text style={[{ textAlignVertical: 'center' }, Styles.overall]}>
              New to TikNTalk ?
            </Text>
            <Button onPress={handleSignUpPress}
              appearance='ghost'>
              Follow me !
            </Button>
          </Layout>
        </Layout>

      </ImageBackground>
    </SafeAreaView>
  );
};