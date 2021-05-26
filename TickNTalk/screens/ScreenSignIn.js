import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Layout, Text, Button, Input, Avatar } from "@ui-kitten/components";
import { useDispatch } from "react-redux";
import Fire from "../firebase/Fire";
import { createActionSignIn } from "../redux/actions/CreateActionSignedIn";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";
import { ImageBackground, SafeAreaView } from "react-native";

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
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={require('../assets/bg.png')}
                      style={{flex: 1, resizeMode: "cover"}}
      >

        <Layout style={[styles.center, {opacity: 0.85}]}>
          <Avatar style={[Styles.overall, {height: 192, width: 192}]}
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

          <Layout style={{flexDirection:'row', backgroundColor: 'transparent', alignSelf:'center', alignItems:'center'}}>
            <Text style={[{textAlignVertical: 'center'}, Styles.overall]}>
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

export default ScreenSignIn;
