import { useNavigation } from "@react-navigation/native";
import React from "react";
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
} from "@ui-kitten/components";
import { useSignedIn } from "../hooks/useSignedIn";
import Fire from "../firebase/Fire";
import * as styles from "../shared/styles";
import { Styles } from "../styles/Styles";
import { SCREENS } from ".";
import {
  ImageBackground,
  Image,
  Keyboard,
  RecyclerViewBackedScrollView,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { TopNavigationBar } from "../components/TopNavigationBar";

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useSignedIn();

  const rowStyle = {
    ...Styles.overall,
    ...Styles.row,
  };

  const handleSignOutPress = () => {
    Fire.signOut().then((isSuccessful) => {
      if (isSuccessful) navigation.navigate(SCREENS.signIn.name);
    });
  };

  const displayPhoneNumber = (number) => (
    `${number.substring(0, 3)} ${number.substring(3,6)} ${number.substring(6, 10)}`
  );

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={{ flex: 1, opacity: 0.95 }}>
          {/* <TopNavigationBar title='About me'/> */}
          <Layout>
            <ScrollView>
              <Layout style={[styles.center]}>
                <Avatar
                  style={[
                    Styles.overall,
                    { height: 192, width: 192, marginTop: 64 },
                  ]}
                  size="large"
                  shape="round"
                  source={require("../assets/user.jpg")}
                />

                <Input
                  style={Styles.overall}
                  label={"Email"}
                  value={"thythythythy@gmail.com"}
                  editable={false}
                />

                <Layout style={rowStyle}>
                  <Input
                    style={{ flex: 3, paddingRight: 4 }}
                    label={"First name"}
                    value={"Thy Thy"}
                    editable={false}
                  />

                  <Input
                    style={{ flex: 2, paddingLeft: 4 }}
                    label={"Last name"}
                    value={"Thy Thy"}
                    editable={false}
                  />
                </Layout>

                <Layout style={rowStyle}>
                  <Datepicker
                    min={new Date(1900, 1, 1)}
                    max={new Date(Date.now())}
                    style={{ flex: 3, paddingRight: 4 }}
                    label={"Birth date"}
                    value={new Date(Date.now())}
                    editable={false}
                  />

                  <Input
                    style={{ flex: 2, paddingLeft: 4 }}
                    label={"Gender"}
                    value={"Femàle"}
                    editable={false}
                  ></Input>
                </Layout>

                <Layout style={rowStyle}>
                  <Input
                    style={{ flex: 1 }}
                    label={"Country"}
                    value={"Thy Thy"}
                    editable={false}
                  />
                </Layout>

                <Input
                  style={Styles.overall}
                  label={"Phone number"}
                  value={displayPhoneNumber("0123456789")}
                  editable={false}
                />

                <Button
                  appearance="outline"
                  style={[Styles.overall, Styles.button, { width: "auto" }]}
                  onPress={handleSignOutPress}
                >
                  EDIT YOUR PROFILE
                </Button>

                <Divider style={{marginTop: 64}}/>
                <Text> Change account ? </Text>
                <Button style={[Styles.overall, Styles.button]}
                  onPress={handleSignOutPress}
                >
                  SIGN OUT
                </Button>

                <Text category="c1"> You've signed in with email </Text>
                <Text category="c1"> {JSON.stringify(user)} </Text>
              </Layout>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenMyProfile;
