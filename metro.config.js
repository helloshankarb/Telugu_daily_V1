const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Block react-native-google-mobile-ads from being processed on web
config.resolver.blockList = [
  /node_modules\/react-native-google-mobile-ads\/.*/,
];

module.exports = config;