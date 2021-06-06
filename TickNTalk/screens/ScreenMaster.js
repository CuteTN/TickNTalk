import React from 'react';
import { Layout } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as styles from '../shared/styles'
import { MASTER_TAB_SCREENS } from '.';

const Tab = createBottomTabNavigator();

const ScreenMaster = () => {
  return (
    <Tab.Navigator>
      {Object.values(MASTER_TAB_SCREENS).map(scr =>
        <Tab.Screen name={scr.name} component={scr.screen} />
      )}
    </Tab.Navigator>
  );
}

export default ScreenMaster;