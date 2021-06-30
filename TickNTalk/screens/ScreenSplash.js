import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
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
  const fadeAnim = useRef(new Animated.Value(START_FADE)).current;

  function runFadeAnimation() {
    Animated.sequence([ 
        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
      }),  
      Animated.timing(fadeAnim, {
        toValue: START_FADE,
        duration: 3000,
      })
    ]).start(() => runFadeAnimation());
  }

  useEffect(() => {
    runFadeAnimation();
  });

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.Image
        style={{
          width: 196,
          height: 196,
          opacity: fadeAnim,
        }}
        source={require("../assets/Logo.png")}
      />
      <Spinner />
    </SafeAreaView>
  );
};
