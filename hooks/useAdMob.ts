import { useEffect, useState } from 'react';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAdMob();
  }, []);

  const initializeAdMob = async () => {
    try {
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
    }
  };

  return { isInitialized };
};