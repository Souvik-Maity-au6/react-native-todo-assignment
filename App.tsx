import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import RNBootSplash from 'react-native-bootsplash';
// App.jsx
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './src/screens/Login';
import ProfileScreen from './src/screens/Profile';
import TodoScreen from './src/screens/Todo';
import {ThemeProvider, useTheme} from './ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}: any) => ({
        tabBarIcon: ({focused, color, size}: any) => {
          let iconName: string = '';

          if (route.name === 'Todo') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
      })}
      backBehavior={'none'}>
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
      //await getUserData();
      await getCurrentUser();
    };

    init().finally(async () => {
      await RNBootSplash.hide({fade: true});
    });
  }, []);

  const getCurrentUser = async () => {
    setLoading(true);
    const currentUser = GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify(currentUser.user),
      );
    } else {
      await AsyncStorage.removeItem('userProfile');
    }
  };

  return isLoading ? (
    <>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{title: 'Login'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </ThemeProvider>
    </>
  ) : (
    <NavigationContainer>{''}</NavigationContainer>
  );
}
