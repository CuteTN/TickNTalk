import React from "react";
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import * as Icon from "./Icon";


const BackAction = () => {
  const navigation = useNavigation();
  return (
    <TopNavigationAction
      icon={Icon.Back}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
};

export const TopNavigationBar = (props) => (
  <Layout>
    <TopNavigation
      style = {[{marginTop: 16}, props.style]}
      accessoryLeft={BackAction}
      title={(evaProps) => <Text style={{fontWeight:'bold'}}>{props.title}</Text>}
    />
    <Divider />
  </Layout>
);
