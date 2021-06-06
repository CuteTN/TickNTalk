import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useSignedIn } from '../hooks/useSignedIn';
import Fire from '../firebase/Fire';
import * as styles from '../shared/styles'
import { SCREENS } from '.';

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useSignedIn();

  const handleSignOutPress = () => {
    Fire.signOut().then(
      ({ successful, errorMessage }) => {
        if (successful) {
          showMessage({ type: 'success', message: `Sign out successfully!` })
          navigation.navigate(SCREENS.signIn.name);
        }
        if (errorMessage) {
          showMessage({ type: 'danger', message: errorMessage.message });
        }
      }
    )
  }


  return (
    <Layout style={styles.center}>
      <Text>MyProfile Screen!</Text>
      <Text>You've signed in with email {JSON.stringify(user)}</Text>
      <Button onPress={handleSignOutPress}>Sign out</Button>
    </Layout>
  );
}

export default ScreenMyProfile;