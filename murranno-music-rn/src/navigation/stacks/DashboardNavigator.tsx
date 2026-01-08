import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../types';
import { darkColors } from '../../theme/colors';

// Screens
import ArtistDashboardScreen from '../../screens/ArtistDashboardScreen';
import LabelDashboardScreen from '../../screens/LabelDashboardScreen';
import AgencyDashboardScreen from '../../screens/AgencyDashboardScreen';
import UserTypeSelectionScreen from '../../screens/UserTypeSelectionScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ArtistDashboard"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="ArtistDashboard" 
        component={ArtistDashboardScreen}
      />
      <Stack.Screen 
        name="LabelDashboard" 
        component={LabelDashboardScreen}
      />
      <Stack.Screen 
        name="AgencyDashboard" 
        component={AgencyDashboardScreen}
      />
      <Stack.Screen 
        name="UserTypeSelection" 
        component={UserTypeSelectionScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
