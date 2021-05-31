import React from 'react';
import { Layout } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as styles from '../shared/styles'
import ScreenMessages from './ScreenMessages'
import ScreenMyProfile from './ScreenMyProfile'

const Tab = createBottomTabNavigator();

const ScreenMaster = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Messages" component={ScreenMessages} />
      <Tab.Screen name="MyProfile" component={ScreenMyProfile} />
    </Tab.Navigator>
  );
}

export default ScreenMaster;