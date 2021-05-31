import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Text, View } from 'react-native'
import { useSignedIn } from '../hooks/useSignedIn';

const ScreenStartUp = () => {
  const navigation = useNavigation();
  const { status } = useSignedIn();

  useEffect(() => {
    switch (status) {
      case "SignedIn":
        navigation.navigate("Master");
        break;
      case "NotSignedIn":
        navigation.navigate("SignIn");
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