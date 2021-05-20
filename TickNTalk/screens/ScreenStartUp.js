import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native'
import Fire from '../firebase/Fire';

const ScreenStartUp = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = Fire.auth().onAuthStateChanged((user) => {
      if (user)
        navigation.navigate("Master");
      else
        navigation.navigate("SignIn");
    })

    return () => {
      unsubscribe();
    }
  }, [])

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

export default ScreenStartUp;