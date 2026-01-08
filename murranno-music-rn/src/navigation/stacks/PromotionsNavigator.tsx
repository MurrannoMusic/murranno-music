import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PromotionsStackParamList } from '../types';
import { darkColors } from '../../theme/colors';

// Screens
import PromotionsScreen from '../../screens/PromotionsScreen';
import CampaignTrackingScreen from '../../screens/CampaignTrackingScreen';

const Stack = createNativeStackNavigator<PromotionsStackParamList>();

export const PromotionsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PromotionsList"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="PromotionsList" 
        component={PromotionsScreen}
      />
      <Stack.Screen 
        name="CampaignTracking" 
        component={CampaignTrackingScreen}
      />
    </Stack.Navigator>
  );
};

export default PromotionsNavigator;
