import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native'
import Fire from '../firebase/Fire';
import * as styles from '../shared/styles'
import { logDebug } from '../Utils/ConsoleLog';

const ScreenSignUp = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigation = useNavigation();

  const handleSignUpPress = () => {
    Fire.signUpWithEmail(email, password).then(
      (isSuccessful) => {
        if (isSuccessful) {
          navigation.navigate("Master");
        }
      }
    )
  }

  return (
    <View style={styles.center}>
      <Text> Sign Up Screen!</Text>
      <TextInput
        placeholder={"Email"}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        placeholder={"Password"}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button onPress={handleSignUpPress} title={"Sign up!"} />
    </View>
  );
}

export default ScreenSignUp;