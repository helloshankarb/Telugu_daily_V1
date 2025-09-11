import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Ad Unit IDs - Replace these with your actual ad unit IDs from AdMob console
export const AD_UNIT_IDS = {
  banner: {
    ios: 'YOUR_IOS_BANNER_AD_UNIT_ID', // Replace with your iOS banner ad unit ID
    android: 'YOUR_ANDROID_BANNER_AD_UNIT_ID', // Replace with your Android banner ad unit ID
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
  
  // Use test ads during development
  if (__DEV__) {
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
  console.log('Using production ad unit for:', adType);
  return Platform.select({
    ios: adUnit.ios,
    android: adUnit.android,
    default: TestIds.BANNER,
  });
};

// Ad configuration
export const AD_CONFIG = {
  // Show ads after these sentence numbers
  bannerPositions: [10, 20, 30, 40, 50],
  
  // Ad request configuration
  requestConfig: {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['education', 'language', 'learning', 'telugu'],
  },
};