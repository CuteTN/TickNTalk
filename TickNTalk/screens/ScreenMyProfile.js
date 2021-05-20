import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSignedIn } from '../hooks/useSignedIn';
import { createActionSignOut } from '../redux/actions/CreateActionSignedIn';
import * as styles from '../shared/styles'

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, updateUser } = useSignedIn();

  const handleSignOutPress = () => {
    navigation.navigate("SignIn");
    dispatch(createActionSignOut());
  }

  const handleTestUpdateUserPress = () => {
    updateUser({ test: user.test ? "" : "ok" })
  }

  return (
    <View style={styles.center}>
      <Text>MyProfile Screen!</Text>
      <Text>You've signed in with email {JSON.stringify(user)}</Text>
      <Button title="Sign out" onPress={handleSignOutPress} />
      <Button title="Test update user" onPress={handleTestUpdateUserPress} />
    </View>
  );
}

export default ScreenMyProfile;