import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {colors, fonts} from '../../constant';
import ButtonComponent from '../components/ButtonComponent';
import {showToast} from '../components/Toast';

GoogleSignin.configure({
  webClientId:
    '235525488079-st6lr3d9aitj1er2shc0an4l2btgh0gl.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/contacts.readonly',
  ], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const Login = ({navigation}: any) => {
  const {theme} = useTheme();
  const {width, height} = useWindowDimensions();
  const [user, setUser] = useState<any>(null);
  const [isInProgress, setProgress] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(true);

  const _signIn = async () => {
    try {
      setProgress(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
      setShowNumberInput(true);
      setShowGoogleSignIn(false);
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            showToast(
              'error',
              'SIGN IN CANCELLED',
              'User cancelled the login flow',
            );
            setProgress(false);
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            showToast('info', 'SIGN IN PROGRESS', '');
            setProgress(true);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            showToast(
              'error',
              'PLAY SERVICES NOT AVAILABLE',
              'Play services not available or outdated',
            );
            setProgress(false);
            break;
          default:
            // some other error happened
            showToast(
              'error',
              'SOMETHING WENT WRONG',
              'Please try after sometime',
            );
            setProgress(false);
        }
      } else {
        // an error that's not related to google sign in occurred
        showToast('error', 'SOMETHING WENT WRONG', 'Please try after sometime');
        setProgress(false);
      }
    }
  };

  const sendOtp = async () => {
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(
        '+91' + phoneNumber,
      );
      setConfirmation(confirmationResult);
      setShowNumberInput(false);
    } catch (error) {
      console.error(error);
      showToast('error', 'HOLD ON', JSON.stringify(`${error}`));
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmation.confirm(otpCode);
      // Handle successful OTP verification
      console.log('OTP Verification Success');
      setProgress(false);
      await AsyncStorage.setItem('userProfile', JSON.stringify(user.user));
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } catch (error) {
      showToast('error', 'HOLD ON', JSON.stringify(`${error}`));
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.background,
        height: height,
      }}>
      <StatusBar
        barStyle={theme.statusBarContent}
        backgroundColor={theme.background}
      />
      <View
        style={{
          alignItems: 'center',

          backgroundColor: theme.background,
          marginTop: '50%',
        }}>
        <View>
          {showGoogleSignIn && (
            <GoogleSigninButton
              id="googleTestButton"
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => {
                // initiate sign in
                _signIn();
              }}
              disabled={isInProgress}
            />
          )}

          {showNumberInput && (
            <View style={{width: width - 100}}>
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
                maxLength={10}
                style={{
                  borderWidth: 1,
                  borderRadius: 6,
                  padding: 10,
                  margin: 20,
                  borderColor: theme.text,
                }}
              />
              {phoneNumber && phoneNumber.length && phoneNumber.length < 10 && (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.regular,
                    color: colors.red,
                    textAlign: 'center',
                  }}>
                  Invalid phone number!
                </Text>
              )}
              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <ButtonComponent
                  title="Send OTP"
                  onPress={sendOtp}
                  disabled={phoneNumber.length < 10}
                />
              </View>
            </View>
          )}
          {confirmation && (
            <View style={{width: width - 100}}>
              <TextInput
                placeholder="OTP Code"
                value={otpCode}
                onChangeText={setOtpCode}
                style={{
                  borderWidth: 1,
                  borderRadius: 6,
                  padding: 10,
                  margin: 20,
                  borderColor: theme.text,
                }}
                maxLength={6}
              />
              {otpCode && otpCode.length && otpCode.length < 6 && (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.regular,
                    color: colors.red,
                    textAlign: 'center',
                  }}>
                  Invalid Otp!
                </Text>
              )}
              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <ButtonComponent
                  title="Verify OTP"
                  onPress={verifyOtp}
                  disabled={otpCode.length < 6}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
