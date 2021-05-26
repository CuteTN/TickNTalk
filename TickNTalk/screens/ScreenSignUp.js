import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import Fire from '../firebase/Fire';
import { createActionSignIn } from '../redux/actions/CreateActionSignedIn';
import * as styles from '../shared/styles'
import { logDebug } from '../Utils/ConsoleLog';
import { Styles } from '../styles/Styles';

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

  return (
    <Layout style={styles.center}>

      <Text style={Styles.overall}> 
        Sign Up Screen!
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
      <Button style={Styles.overall} 
              onPress={handleSignUpPress}
      >
        SIGN UP
      </Button>

    </Layout>
  );
}

export default ScreenSignUp;