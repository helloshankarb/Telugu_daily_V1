import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Only import AdMob on native platforms
let mobileAds: any = null;
let MaxAdContentRating: any = null;

if (Platform.OS !== 'web') {
  try {
    const adMobModule = require('react-native-google-mobile-ads');
    mobileAds = adMobModule.default;
    MaxAdContentRating = adMobModule.MaxAdContentRating;
    console.log('AdMob hook: Module imported successfully');
  } catch (error) {
    console.error('AdMob hook: Failed to import module:', error);
  }
}

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(Platform.OS === 'web');
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initializeAdMob();
    } else {
      console.log('AdMob hook: Skipping initialization on web platform');
    }
  }, []);

  const initializeAdMob = async () => {
    if (Platform.OS === 'web' || !mobileAds) {
      console.log('AdMob hook: Skipping initialization - web platform or no mobileAds');
      setIsInitialized(true);
      return;
    }

    try {
      console.log('AdMob hook: Starting initialization...');
      await mobileAds().initialize();
      console.log('AdMob hook: Basic initialization complete');
      
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

      console.log('AdMob hook: Request configuration set');
      setIsInitialized(true);
      console.log('AdMob hook: Initialization completed successfully');
    } catch (error) {
      console.error('AdMob hook: Initialization failed:', error);
      setInitError(error?.toString() || 'Unknown error');
      // Set as initialized even if failed to prevent blocking the app
      setIsInitialized(true);
    }
  };

  return { isInitialized, initError };
};