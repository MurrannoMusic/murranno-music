import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { colors } from '../theme/colors';

// Screen imports (to be replaced with actual screen components)
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
// Placeholder screens - create these in your project
// import GetStartedScreen from '../screens/GetStartedScreen';
// import LoginScreen from '../screens/LoginScreen';
// import SignupScreen from '../screens/SignupScreen';
// import VerifyEmailScreen from '../screens/VerifyEmailScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder component for screens not yet created
const PlaceholderScreen = () => null;

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="GetStarted" 
        component={PlaceholderScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={PlaceholderScreen}
      />
      <Stack.Screen 
        name="Signup" 
        component={PlaceholderScreen}
      />
      <Stack.Screen 
        name="VerifyEmail" 
        component={PlaceholderScreen}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={PlaceholderScreen}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={PlaceholderScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
