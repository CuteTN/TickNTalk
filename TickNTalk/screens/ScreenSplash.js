import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useFocusEffect } from "react";
import {
  Layout,
  Text,
  Button,
  Input,
  Avatar,
  Select,
  SelectItem,
  Datepicker,
  Divider,
  Spinner,
} from "@ui-kitten/components";
import * as styles from "../shared/styles";
import { Styles, SafeView } from "../styles/Styles";
import {
  Animated,
  ImageBackground,
  Image,
  Keyboard,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

export const ScreenSplash = () => {
  const START_FADE = 0.7;

  
  

  useEffect(() => {
    //runFadeAnimation();
  }); 


  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.Image
        style={{
          width: 196,
          height: 196,
        }}
        source={require("../assets/Logo.png")}
      />
    </SafeAreaView>
  );
};
