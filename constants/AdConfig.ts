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
    ios: 'ca-app-pub-8215136966042517/2425759189',
    android: 'ca-app-pub-8215136966042517/7006752588',
  },
  interstitial: {
    ios: 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID', // Replace with your iOS interstitial ad unit ID
    android: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID', // Replace with your Android interstitial ad unit ID
  },
  rewarded: {
    ios: 'YOUR_IOS_REWARDED_AD_UNIT_ID', // Replace with your iOS rewarded ad unit ID
    android: 'YOUR_ANDROID_REWARDED_AD_UNIT_ID', // Replace with your Android rewarded ad unit ID
  },
};

// Helper function to get the appropriate ad unit ID
export const getAdUnitId = (adType: keyof typeof AD_UNIT_IDS): string => {
  const adUnit = AD_UNIT_IDS[adType];
  
  console.log(`AdConfig: Getting ad unit for ${adType}, __DEV__ = ${__DEV__}`);
  
  // Always use real ads for testing - comment this out to use test ads
  // if (__DEV__ && TestIds) {
  if (false && TestIds) {
    console.log('Using test ad unit for development:', adType);
    switch (adType) {
      case 'banner':
        return TestIds.BANNER;
      case 'interstitial':
        return TestIds.INTERSTITIAL;
      case 'rewarded':
        return TestIds.REWARDED;
      default:
        return TestIds.BANNER;
    }
  }
  
  // Use production ad unit IDs
  const productionId = Platform.select({
    ios: adUnit.ios,
    android: adUnit.android,
    default: TestIds?.BANNER || 'ca-app-pub-3940256099942544/6300978111',
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
    keywords: ['education', 'language', 'learning', 'telugu'],
  },
};