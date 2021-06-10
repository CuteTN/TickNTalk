import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from 'react';
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
import { useRealtimeFire } from '../hooks/useRealtimeFire';
import { navigateAndReset } from '../Utils/navigation';

const ScreenMyProfile = () => {
  const navigation = useNavigation();
  const { user } = useSignedIn();
  const [users,] = useRealtimeFire("user");

  useEffect(() => {
    // console.log(users);
  }, [users])

  const handleSignOutPress = () => {
    Fire.signOut().then(
      ({ successful, errorMessage }) => {
        if (successful) {
          navigateAndReset(navigation, SCREENS.signIn.name);
          showMessage({ type: 'success', message: `Sign out successfully!` })
        }
        if (errorMessage) {
          showMessage({ type: 'danger', message: errorMessage.message });
        }
      }
    )
  }
  const handleUpdateAvatarPress = () => {
    navigation.navigate(SCREENS.editUserAva.name);
  }

  const rowStyle = {
    ...Styles.overall,
    ...Styles.row,
  };

  const displayPhoneNumber = (number) => (
    `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)}`
  );


  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', marginBottom: 16 }}>
          <TopNavigationBar title='About me' navigation={navigation} />
          <Layout style={{ backgroundColor: 'transparent' }}>
            <ScrollView style={{ backgroundColor: 'transparent' }}>
              <Layout style={[styles.center], { backgroundColor: 'rgba(255,255,255,0.8)' }}>
                <Avatar
                  style={[
                    Styles.overall,
                    { height: 192, width: 192, marginTop: 16, alignSelf: 'center' },
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

                <Divider style={{ marginTop: 64 }} />
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

          <Layout style={styles.center}>
            <Text>MyProfile Screen!</Text>
            <Text>You've signed in with email {JSON.stringify(user)}</Text>

            {/* thêm phần thay avatar, sẽ nhấn vào cái hình avatar để thay ava*/}
            <Button onPress={handleUpdateAvatarPress}>Thay ava</Button>


            <Button onPress={handleSignOutPress}>Sign out</Button>
          </Layout>
        </SafeAreaView>
      </ImageBackground>
    </Layout>
  );
};

export default ScreenMyProfile;
