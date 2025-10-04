const { getDefaultConfig } = require('expo/metro-config');
const { Platform } = require('react-native');

const config = getDefaultConfig(__dirname);

module.exports = config;