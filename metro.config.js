const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add a specific alias for web platform
// This will tell Metro to resolve 'react-native-google-mobile-ads' to our mock file
// when bundling for the 'web' platform.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-google-mobile-ads': path.resolve(__dirname, 'mocks/react-native-google-mobile-ads.js'),
};

// Keep the blockList as a safeguard, though the extraNodeModules should take precedence for direct imports.
config.resolver.blockList = [
  /node_modules\/react-native-google-mobile-ads\/.*/,
];

module.exports = config;