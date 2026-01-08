import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EarningsStackParamList } from '../types';
import { darkColors } from '../../theme/colors';

// Screens
import EarningsScreen from '../../screens/EarningsScreen';
import AnalyticsScreen from '../../screens/AnalyticsScreen';

const Stack = createNativeStackNavigator<EarningsStackParamList>();

export const EarningsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="EarningsOverview"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="EarningsOverview" 
        component={EarningsScreen}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
      />
    </Stack.Navigator>
  );
};

export default EarningsNavigator;
