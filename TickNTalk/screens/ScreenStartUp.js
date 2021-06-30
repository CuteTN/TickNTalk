import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Text, View } from 'react-native'
import { SCREENS } from '.';
import { useSignedIn } from '../hooks/useSignedIn';
import { navigateAndReset } from '../Utils/navigation';
import { ScreenSplash } from './ScreenSplash';

const ScreenStartUp = () => {
  const navigation = useNavigation();
  const { status } = useSignedIn();

  useEffect(() => {
    switch (status) {
      case "SignedIn":
        navigateAndReset(navigation, SCREENS.master.name);
        break;
      case "NoInfo":
        navigateAndReset(navigation, SCREENS.myProfile.name);
        break;
      case "NotSignedIn":
        navigateAndReset(navigation, SCREENS.signIn.name);
        break;
    }
  }, [status])

  return (
    <ScreenSplash />
  );
}

export default ScreenStartUp;