import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Layout, Text, Button, Input, Avatar } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import Fire from '../firebase/Fire';
import { createActionSignIn } from '../redux/actions/CreateActionSignedIn';
import * as styles from '../shared/styles'
import { logDebug } from '../Utils/ConsoleLog';
import { Styles } from '../styles/Styles';
import { ImageBackground, SafeAreaView } from "react-native";

const ScreenSignUp = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleSignUpPress = () => {
    Fire.signUpWithEmail(email, password).then(
      (isSuccessful) => {
        if (isSuccessful) {
          navigation.navigate("Master");
          dispatch(createActionSignIn(email));
        }
      }
    )
  }

  const handleSignInPress = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={require('../assets/bg.png')}
                      style={{flex: 1, resizeMode: "cover"}}
      >

        <Layout style={[styles.center, {opacity: 0.95}]}>
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

          <Button style={[Styles.overall, Styles.button]}
                  onPress={handleSignUpPress}
          >
            SIGN UP
          </Button>

          <Layout style={{flexDirection:'row', backgroundColor: 'transparent', alignSelf:'center', alignItems:'center'}}>
            <Text style={[{textAlignVertical: 'center'}, Styles.overall]}>
              Already a close homie ?
            </Text>
            <Button onPress={handleSignInPress}
                    appearance='ghost'>
              Sign in
            </Button>
          </Layout>
        </Layout>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ScreenSignUp;