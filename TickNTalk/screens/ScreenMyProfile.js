import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createActionSignOut } from '../redux/actions/CreateActionSignedIn';
import * as styles from '../shared/styles'

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const signedInInfo = useSelector(state => state.reducerSignedIn)

  const handleSignOutPress = () => {
    navigation.navigate("SignIn");
    dispatch(createActionSignOut());
  }

  return (
    <View style={styles.center}>
      <Text>MyProfile Screen!</Text>
      <Text>You've signed in with email {signedInInfo?.email}</Text>
      <Button title="Sign out" onPress={handleSignOutPress} />
    </View>
  );
}

export default ScreenMyProfile;