import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';
import Fire from '../firebase/Fire';
import { useSignedIn } from '../hooks/useSignedIn';
import * as styles from '../shared/styles'

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useSignedIn();

  const handleSignOutPress = () => {
    Fire.signOut().then(isSuccessful => {
      if (isSuccessful)
        navigation.navigate("SignIn");
    })
    // navigation.navigate("SignIn");
  }

  //#region test function
  const handleNavToSignInPress = () => {
    navigation.navigate("SignIn");
  }

  const handleTestUpdateUserPress = () => {
    updateUser({ test: user.test ? "" : "ok" })
  }
  //#endregion

  return (
    <View style={styles.center}>
      <Text>MyProfile Screen!</Text>
      <Text>You've signed in with email {JSON.stringify(user)}</Text>
      <Button title="Sign out" onPress={handleSignOutPress} />
      <Button title="nav to Sign in" onPress={handleNavToSignInPress} />
      <Button title="Test update user" onPress={handleTestUpdateUserPress} />
    </View>
  );
}

export default ScreenMyProfile;