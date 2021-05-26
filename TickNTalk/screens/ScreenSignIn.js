import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Layout, Text, Button, Input } from "@ui-kitten/components";
import { useDispatch } from "react-redux";
import Fire from "../firebase/Fire";
import { createActionSignIn } from "../redux/actions/CreateActionSignedIn";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";

const ScreenSignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleSignInPress = () => {
    Fire.signInWithEmail(email, password).then((isSuccess) => {
      if (isSuccess) {
        navigation.navigate("Master");
        dispatch(createActionSignIn(email));
      }
    });
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <Layout style={styles.center}>
      <Text category="h1" style={Styles.overall}>
        SIGN IN SCREEN
      </Text>

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

      <Button onPress={handleSignInPress} style={Styles.overall}>
        SIGN IN
      </Button>

      <Button onPress={handleSignUpPress} style={Styles.overall}>
        SIGN UP
      </Button>
    </Layout>
  );
};

export default ScreenSignIn;
