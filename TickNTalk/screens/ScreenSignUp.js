import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Layout, Text, Button, Input, Avatar, Select, SelectItem, Datepicker, Icon } from '@ui-kitten/components';
import Fire from '../firebase/Fire';
import * as styles from '../shared/styles'
import { Styles } from '../styles/Styles';
import { ImageBackground, Image, Keyboard, RecyclerViewBackedScrollView, SafeAreaView } from "react-native";
import { SCREENS } from '.';

const ScreenSignUp = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const GENDERS = ["Male", "Female", "Other"];
  const [genderSelectedIndex, setGenderSelectedIndex] = useState();

  const [selectedBirthday, setSelectedBirthday] = useState(new Date());

  const navigation = useNavigation();

  const getCurrentGender = () => GENDERS[genderSelectedIndex - 1];

  const handleSignUpPress = () => {
    Fire.signUpWithEmail(email, password).then(
      (isSuccessful) => {
        if (isSuccessful) {
          navigation.navigate(SCREENS.master.name);
        }
      }
    )
  }

  const handleSignInPress = () => {
    navigation.navigate(SCREENS.signIn.name);
  };

  const rowStyle = {
    ...Styles.overall,
    ...Styles.row,
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/bg.png')}
        style={{ flex: 1, resizeMode: "cover" }}
      >

        <Layout style={[styles.center, { opacity: 0.95 }]}>
          <Avatar style={[Styles.overall, { height: 192, width: 192 }]}
            size='large'
            shape='square'
            source={require('../assets/Logo.png')}
          />

          <Input
            style={Styles.overall}
            placeholder={"Email"}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Layout style={rowStyle}>
            <Input
              style={{ flex: 3, paddingRight: 4 }}
              placeholder={"First name"}
              onChangeText={setEmail}
            />

            <Input
              style={{ flex: 2, paddingLeft: 4 }}
              placeholder={"Last name"}
              onChangeText={setEmail}
            />
          </Layout>



          <Layout style={rowStyle}>
            <Datepicker
              date={selectedBirthday}
              min={new Date(1900, 1, 1)}
              max={new Date(Date.now())}
              style={{ flex: 3, paddingRight: 4 }}
              onSelect={setSelectedBirthday}
              placeholder={"Birthday"}
            />

            <Select
              style={{ flex: 2, paddingLeft: 4 }}
              placeholder={"Gender"}
              value={getCurrentGender()}
              selectedIndex={genderSelectedIndex}
              onSelect={setGenderSelectedIndex}
            >
              {GENDERS.map(g => <SelectItem title={g} />)}
            </Select>
          </Layout>

          <Layout style={rowStyle}>
            <Input
              style={{ flex: 1 }}
              placeholder={"Country"}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </Layout>

          <Input
            style={Styles.overall}
            placeholder={"Phone number"}
            keyboardType="phone-pad"
            onChangeText={setEmail}
          />

          <Input
            style={Styles.overall}
            placeholder={"Password"}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Input
            style={Styles.overall}
            placeholder={"Confirm password"}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Button style={[Styles.overall, Styles.button]}
            onPress={handleSignUpPress}
          >
            SIGN UP
          </Button>

          <Layout style={{ flexDirection: 'row', backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'center' }}>
            <Text style={[{ textAlignVertical: 'center' }, Styles.overall]}>
              Already a close homie ?
            </Text>
            <Button onPress={handleSignInPress}
              appearance='ghost'>
              Sign in
            </Button>
          </Layout>
        </Layout>
      </ImageBackground>
    </Layout >
  );
}

export default ScreenSignUp;