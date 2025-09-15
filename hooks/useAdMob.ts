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
      console.log('useAdMob: Skipping initialization - web platform or no mobileAds');
      setIsInitialized(true);
      return;
    }

    try {
      console.log('useAdMob: Starting AdMob initialization...');
      await mobileAds().initialize();
      console.log('useAdMob: Basic initialization complete');
      
      // Configure ad settings
      await mobileAds().setRequestConfiguration({
        // Set max ad content rating to PG for family-friendly content
        maxAdContentRating: MaxAdContentRating.PG,
        
        // Not child-directed content
        tagForChildDirectedTreatment: false,
        
        // Not under age of consent
        tagForUnderAgeOfConsent: false,
        
        // IMPORTANT: Empty array for production to get real ads
        testDeviceIdentifiers: [], // Keep empty for real ads
        
        // Additional production settings
        tagForUnderAgeOfConsent: false,
        maxAdContentRating: MaxAdContentRating.PG,
      });

      console.log('useAdMob: Request configuration set successfully');
      console.log('useAdMob: PRODUCTION MODE - Real ads will be served');
      setIsInitialized(true);
      console.log('useAdMob: AdMob initialization completed successfully');
    } catch (error) {
      console.error('useAdMob: AdMob initialization failed:', error);
      setInitError(error?.toString() || 'Unknown error');
      // Still set as initialized to prevent blocking the app
      setIsInitialized(true);
    }
  };

  return { isInitialized, initError };
};