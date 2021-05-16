import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native'
import { useDispatch } from 'react-redux';
import Fire from '../firebase/Fire';
import { createActionSignIn } from '../redux/actions/CreateActionSignedIn';
import * as styles from '../shared/styles'

const ScreenSignIn = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleSignInPress = () => {
    Fire.signInWithEmail(email, password).then(
      (isSuccess) => {
        if (isSuccess) {
          navigation.navigate("Master");
          dispatch(createActionSignIn(email))
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