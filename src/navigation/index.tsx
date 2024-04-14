import {createStackNavigator} from '@react-navigation/stack';
import {Home, Login, Profile} from '../screens';

type StackParams = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<StackParams>();

export const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export type NavParams = StackParams;
