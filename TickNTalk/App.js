import Fire from './firebase/Fire'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TestFirebaseLoaded from './_testFrame/TestFrame01'
import { dbSetUp } from './firebase/DbSetUp';
import { reduxStore } from './redux/store';

// ignore warnings
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';

// navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import ScreenSignIn from './screens/ScreenSignIn';
import ScreenSignUp from './screens/ScreenSignUp';
import ScreenMaster from './screens/ScreenMaster';

//UI Kitten configs
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { default as theme } from './theme.json';
import { IoniconPack } from './vector-icons';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

dbSetUp()
const Stack = createStackNavigator()

export default function App() {
  return (
    <>
      <IconRegistry icons = {IoniconPack}/>
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}> 
        <Provider store={reduxStore}>
          <Layout style={styles.container}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="SignIn" headerMode="none">
                <Stack.Screen name="SignIn" component={ScreenSignIn} />
                <Stack.Screen name="SignUp" component={ScreenSignUp} />
                <Stack.Screen name="Master" component={ScreenMaster} />
              </Stack.Navigator>
            </NavigationContainer>
            {/* <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" /> */}
            {/* <TestFirebaseLoaded /> */}
          </Layout>
        </Provider>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'space-around'
  },
});
