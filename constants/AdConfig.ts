import { Platform } from 'react-native';

// Import TestIds only on native platforms
let TestIds: any = null;
if (Platform.OS !== 'web') {
  try {
    const adMobModule = require('react-native-google-mobile-ads');
    TestIds = adMobModule.TestIds;
    console.log('AdConfig: TestIds imported successfully');
  } catch (error) {
    console.error('AdConfig: Failed to import TestIds:', error);
  }
}

// Ad Unit IDs - Replace these with your actual ad unit IDs from AdMob console
export const AD_UNIT_IDS = {
  banner: {
    ios: 'ca-app-pub-8215136966042517/7006752588',
    android: 'ca-app-pub-8215136966042517/7006752588',
  },
  interstitial: {
    ios: 'ca-app-pub-8215136966042517/1376950131',
    android: 'ca-app-pub-8215136966042517/1376950131',
  },
  rewarded: {
    ios: 'ca-app-pub-8215136966042517/1376950131',
    android: 'ca-app-pub-8215136966042517/1376950131',
  },
};

// Helper function to get the appropriate ad unit ID
export const getAdUnitId = (adType: keyof typeof AD_UNIT_IDS): string => {
  const adUnit = AD_UNIT_IDS[adType];
  
  console.log(`AdConfig: Getting ad unit for ${adType}, __DEV__ = ${__DEV__}`);
  
  // Use production ad unit IDs
  const productionId = Platform.select({
    ios: adUnit.ios,
    android: adUnit.android,
    default: adUnit.android, // Fallback to Android ID
  });
  
  console.log('Using production ad unit for:', adType, 'ID:', productionId);
  return productionId;
};

// Ad configuration
export const AD_CONFIG = {
  // Show ads after these sentence numbers
  bannerPositions: [10, 20, 30, 40, 50],
  
  // Ad request configuration
  requestConfig: {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['education', 'language', 'learning', 'telugu', 'study', 'vocabulary'],
    contentUrl: 'https://telugulearning.app',
  },
};