import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReleasesStackParamList } from '../types';
import { darkColors } from '../../theme/colors';

// Screens
import ReleasesScreen from '../../screens/ReleasesScreen';
import ReleaseDetailScreen from '../../screens/ReleaseDetailScreen';
import UploadScreen from '../../screens/UploadScreen';

const Stack = createNativeStackNavigator<ReleasesStackParamList>();

export const ReleasesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReleasesList"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="ReleasesList" 
        component={ReleasesScreen}
      />
      <Stack.Screen 
        name="ReleaseDetail" 
        component={ReleaseDetailScreen}
      />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ReleasesNavigator;
