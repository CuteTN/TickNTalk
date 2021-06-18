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


export const BackAction = () => {
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
      style = {[props.style, {height: 64}]}
      accessoryLeft={BackAction}
      title={(evaProps) => <Text style={{fontWeight:'300'}} category='h6'>{props.title}</Text>}
      alignment="center"
    />
    <Divider />
  </Layout>
);
