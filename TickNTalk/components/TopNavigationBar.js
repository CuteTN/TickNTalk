import React from 'react';
import { Icon, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useNavigation } from "@react-navigation/native";

//const navigation = useNavigation();

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' pack='ionicon'/>
);

const BackAction = () => (
  null
  // <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
);

export default TopNavigationBar = (title) => (
  <TopNavigation
    accessoryLeft={BackAction}
    title={title}
  />
);