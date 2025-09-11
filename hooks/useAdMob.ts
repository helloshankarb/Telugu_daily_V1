import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Only import AdMob on native platforms
let mobileAds: any = null;
let MaxAdContentRating: any = null;

if (Platform.OS !== 'web') {
  const adMobModule = require('react-native-google-mobile-ads');
  mobileAds = adMobModule.default;
  MaxAdContentRating = adMobModule.MaxAdContentRating;
}

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initializeAdMob();
    }
  }, []);

  const initializeAdMob = async () => {
    if (Platform.OS === 'web' || !mobileAds) {
      console.log('Skipping AdMob initialization on web platform');
      return;
    }

    try {
      console.log('Initializing AdMob...');
      await mobileAds().initialize();
      
      // Configure ad settings
      await mobileAds().setRequestConfiguration({
        // Update max ad content rating
        maxAdContentRating: MaxAdContentRating.PG,
        
        // Indicate that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: false,
        
        // Indicate that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: false,
        
        // An array of test device IDs to allow.
        testDeviceIdentifiers: ['EMULATOR'],
      });

      setIsInitialized(true);
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
      // Set as initialized even if failed to prevent blocking the app
      setIsInitialized(true);
    }
  };

  return { isInitialized };
};