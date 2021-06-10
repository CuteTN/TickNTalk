import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useSignedIn } from '../hooks/useSignedIn';
import Fire from '../firebase/Fire';
import * as styles from '../shared/styles'
import { SCREENS } from '.';
import { useRealtimeFire } from '../hooks/useRealtimeFire';
import { navigateAndReset } from '../Utils/navigation';

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user } = useSignedIn();
  const [users,] = useRealtimeFire("user");

  useEffect(() => {
    // console.log(users);
  }, [users])

  const handleSignOutPress = () => {
    Fire.signOut().then(
      ({ successful, errorMessage }) => {
        if (successful) {
          navigateAndReset(navigation, SCREENS.signIn.name);
          showMessage({ type: 'success', message: `Sign out successfully!` })
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