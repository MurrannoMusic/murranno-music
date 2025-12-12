/**
 * Babel Configuration for NativeWind
 * Required for Tailwind CSS support in React Native
 */

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Required for expo-router if using file-based routing
      // 'expo-router/babel',
      
      // Enable reanimated if using react-native-reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
