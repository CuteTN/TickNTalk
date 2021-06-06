import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Text, View } from 'react-native'
import { SCREENS } from '.';
import { useSignedIn } from '../hooks/useSignedIn';

const ScreenStartUp = () => {
  const navigation = useNavigation();
  const { status } = useSignedIn();

  useEffect(() => {
    switch (status) {
      case "SignedIn":
        navigation.navigate(SCREENS.master.name);
        break;
      case "NotSignedIn":
        navigation.navigate(SCREENS.signIn.name);
        break;
    }
  }, [status])

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

export default ScreenStartUp;