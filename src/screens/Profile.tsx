import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '../../ThemeContext';
import {fonts} from '../../constant';
import ButtonComponent from '../components/ButtonComponent';
const Profile = ({navigation}: any) => {
  const {theme, toggleTheme} = useTheme();
  const {width, height} = useWindowDimensions();
  const [user, setUser] = React.useState<any>(null);
  const [isEnabled, setIsEnabled] = React.useState(false);

  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const result = await AsyncStorage.getItem('userProfile');
    if (result) {
      setUser(JSON.parse(result));
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser({user: null}); // Remember to remove the user from your app's state as well
      await AsyncStorage.removeItem('userProfile');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState: boolean) => !previousState);
    toggleTheme();
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.background,
      }}>
      <StatusBar
        barStyle={theme.statusBarContent}
        backgroundColor={theme.background}
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          height: height,
        }}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 18,
            color: theme.text,
          }}>
          Profile
        </Text>
        <View
          style={{
            marginTop: 20,
            marginLeft: '50%',
          }}>
          <Text style={{color: theme.text}}>Switch Theme</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {user && (
          <View
            style={{
              marginTop: '20%',
              marginBottom: '20%',
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Image
                source={{uri: user.photo}}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 20,
                  borderRadius: 50,
                  alignItems: 'center',
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 16,
                color: theme.text,
              }}>
              {user.name}
            </Text>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 16,
                color: theme.text,
              }}>
              {user.email}
            </Text>
          </View>
        )}
        <ButtonComponent
          title="Logout"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
