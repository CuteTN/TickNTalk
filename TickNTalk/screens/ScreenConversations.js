import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import * as styles from "../shared/styles";
import {
  Image,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { MessageCard } from "../components/index";
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from '.';

const ScreenConversations = () => {
  const navigation = useNavigation();
  const handleMessagePress = () => {
    navigation.navigate(SCREENS.message.name);
  };
  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Layout style={{ flex: 1 }}>
            <ScrollView>
              <Layout style={[styles.center]}>
                <SearchBar
                  platform="ios"
                  placeholder="Tìm bạn bè..."
                  lightTheme="true"
                  containerStyle={{
                    marginHorizontal: 8,
                    backgroundColor: "transparent",
                    width: "95%",
                  }}
                  inputContainerStyle={{
                    backgroundColor: "whitesmoke",
                    borderRadius: 23,
                  }}
                  leftIconContainerStyle={{ marginLeft: 16 }}
                  inputStyle={{}}
                  placeholder="Tìm kiếm bạn bè.."
                // onChangeText={(Text) => {
                //   this.setState({ toSearchText: Text });
                //   this.onChangeSearchText(Text);
                // }}
                // value={this.state.toSearchText}
                />
                {/*  Binding message list */}
                <TouchableOpacity onPress={handleMessagePress}>
                  <MessageCard
                    Name="Chó"
                    LastestChat="aaa"
                    ImageSource="../assets/bg.png"
                  />
                </TouchableOpacity>
              </Layout>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenConversations;
