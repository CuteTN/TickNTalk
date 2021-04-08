import Fire from './firebase/Fire'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TestFirebaseLoaded from './_testFrame/TestFrame01'
import { dbSetUp } from './firebase/DbSetUp';
import { reduxStore } from './redux/store';

// ignore warnings
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

dbSetUp()

export default function App() {
  return (
    <Provider store={reduxStore}>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" /> */}
        <TestFirebaseLoaded/>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
