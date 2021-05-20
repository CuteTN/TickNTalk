import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native'
import Fire from '../firebase/Fire';
import { useSignedIn } from '../hooks/useSignedIn';
import * as styles from '../shared/styles'

const ScreenSignIn = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigation = useNavigation();

  const handleSignInPress = () => {
    Fire.signInWithEmail(email, password).then(
      (isSuccess) => {
        if (isSuccess) {
          navigation.navigate("Master");
        }
      }
    )
  }

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  }

  return (
    <View style={styles.center}>
      <Text> Sign In Screen!</Text>
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
      <Button onPress={handleSignInPress} title={"Sign in!"} />
      <Button onPress={handleSignUpPress} title={"Sign up!"} />
    </View>
  );
}

export default ScreenSignIn;