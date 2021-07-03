import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Layout, Text, Button, Input, Avatar } from '@ui-kitten/components';
import Fire from '../firebase/Fire';
import * as styles from '../shared/styles'
import { Styles } from '../styles/Styles';
import { ImageBackground, SafeAreaView } from "react-native";
import { SCREENS } from '.';
import { validateEmail } from '../Utils/FieldsValidating';
import { showMessage } from 'react-native-flash-message';
import { navigateAndReset } from '../Utils/navigation';

const ScreenSignUp = () => {
  /** @typedef {{email:string, password:string, passwordConfirm:string}} inputType */
  /** @type [inputType, React.Dispatch<(prevState: inputType) => inputType>] */
  const [input, setInput] = useState();

  const navigation = useNavigation();

  const handleSignUpPress = () => {
    const { email, password, passwordConfirm } = input;

    if (!validateEmail(email)) {
      showMessage({ message: "Email is not valid.", type: 'danger' });
      return;
    };

    if (password !== passwordConfirm) {
      showMessage({ message: "Password confirmation doesn't match", type: "danger" });
      return;
    }

    Fire.signUpWithEmail(email, password).then(
      ({ successful, errorMessage }) => {
        if (successful) {
          navigateAndReset(navigation, SCREENS.myProfile.name);
          showMessage({ type: 'success', message: `Sign up with email ${email} successfully!` });
        }
        if (errorMessage) {
          showMessage({ type: 'danger', message: errorMessage.message });
        }
      }
    )
  }

  const handleInputChangeFunc = (field) => (newValue) => {
    setInput(prev => ({ ...prev, [field]: newValue }));
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
            onChangeText={handleInputChangeFunc("email")}
          />

          <Input
            style={Styles.overall}
            placeholder={"Password"}
            secureTextEntry={true}
            onChangeText={handleInputChangeFunc("password")}
          />

          <Input
            style={Styles.overall}
            placeholder={"Confirm password"}
            secureTextEntry={true}
            onChangeText={handleInputChangeFunc("passwordConfirm")}
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