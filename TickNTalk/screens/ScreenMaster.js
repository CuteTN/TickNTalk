import React from "react";
import { Layout, Text, BottomNavigation, BottomNavigationTab, TopNavigation } from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as styles from "../shared/styles";
import { MASTER_TAB_SCREENS } from ".";
import { State } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='CONVERSATION'/>
    <BottomNavigationTab title='MY INFO'/>
  </BottomNavigation>
);

const ScreenMaster = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      {Object.values(MASTER_TAB_SCREENS).map((scr) => (
        <Tab.Screen name={scr.name} component={scr.screen} />
      ))}
    </Tab.Navigator>
  );
};

export default ScreenMaster;
