import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';
import { darkColors } from '../../theme/colors';

// Screens
import ProfileScreen from '../../screens/ProfileScreen';
import ArtistProfileScreen from '../../screens/ArtistProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileOverview"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="ProfileOverview" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="ArtistProfile" 
        component={ArtistProfileScreen}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
