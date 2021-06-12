import React, { useEffect } from "react";
import { Layout, Text, BottomNavigation, BottomNavigationTab, TopNavigation } from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as styles from "../shared/styles";
import { MASTER_TAB_SCREENS, SCREENS } from ".";
import { State } from "react-native-gesture-handler";
import { useSignedIn } from "../hooks/useSignedIn";
import { useNavigation } from "@react-navigation/native";
import { checkEnoughUserInfo } from "../Utils/FieldsValidating";
import { navigateAndReset } from "../Utils/navigation";

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    {Object.values(MASTER_TAB_SCREENS).map(scr => (
      <BottomNavigationTab title={scr.title} />
    ))}
  </BottomNavigation>
);

const ScreenMaster = () => {
  const { status } = useSignedIn();
  const navigation = useNavigation();

  useEffect(() => {
    if (status === "NoInfo") {
      navigateAndReset(navigation, SCREENS.myProfile.name);
    }

  }, [status])

  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      {Object.values(MASTER_TAB_SCREENS).map((scr) => (
        <Tab.Screen name={scr.name} component={scr.screen} />
      ))}
    </Tab.Navigator>
  );
};

export default ScreenMaster;
