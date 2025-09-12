import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import { getAdUnitId, AD_CONFIG } from '@/constants/AdConfig';

// Only import AdMob components on native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== 'web') {
  try {
    const adMobModule = require('react-native-google-mobile-ads');
    BannerAd = adMobModule.BannerAd;
    BannerAdSize = adMobModule.BannerAdSize;
    console.log('BannerAd: AdMob module loaded successfully');
  } catch (error) {
    console.error('BannerAd: Failed to load AdMob module:', error);
  }
}

interface BannerAdComponentProps {
  adUnitId?: string;
  size?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

export default function BannerAdComponent({ 
  adUnitId, 
  size,
  onAdLoaded,
  onAdFailedToLoad
}: BannerAdComponentProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const screenWidth = Dimensions.get('window').width;
  
  // Don't render ads on web platform
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.placeholderText}>📱 Real Banner Ad</Text>
        <Text style={styles.placeholderSubtext}>This will be a real ad on mobile</Text>
      </View>
    );
  }

  // Check if AdMob components are available
  if (!BannerAd || !BannerAdSize) {
    console.error('BannerAd: AdMob components not available');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>AdMob not available</Text>
      </View>
    );
  }

  const finalAdUnitId = adUnitId || getAdUnitId('banner');
  const finalSize = size || BannerAdSize.BANNER; // Use standard banner instead of adaptive

  console.log('BannerAd: Rendering with unitId:', finalAdUnitId);
  
  const handleAdLoaded = () => {
    console.log('BannerAd: Ad loaded successfully');
    setAdLoaded(true);
    setIsLoading(false);
    setAdError(null);
    onAdLoaded?.();
  };

  const handleAdFailedToLoad = (error: any) => {
    console.error('BannerAd: Ad failed to load:', error);
    setAdLoaded(false);
    setIsLoading(false);
    setAdError(error?.message || 'Failed to load ad');
    onAdFailedToLoad?.(error);
  };

  const handleAdOpened = () => {
    console.log('BannerAd: Ad opened');
  };

  const handleAdClosed = () => {
    console.log('BannerAd: Ad closed');
  };

  const handleAdClicked = () => {
    console.log('BannerAd: Ad clicked');
  };

  const handleAdImpression = () => {
    console.log('BannerAd: Ad impression recorded');
  };

  // Reset loading state when component mounts
  useEffect(() => {
    setIsLoading(true);
    setAdError(null);
    setAdLoaded(false);
  }, [finalAdUnitId]);

  return (
    <View style={styles.container}>
      {isLoading && !adLoaded && !adError && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ad...</Text>
        </View>
      )}
      
      {adError && !adLoaded && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad unavailable</Text>
          <Text style={styles.errorSubtext}>Please check your connection</Text>
        </View>
      )}

      <BannerAd
        unitId={finalAdUnitId}
        size={finalSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: AD_CONFIG.requestConfig.keywords,
          contentUrl: AD_CONFIG.requestConfig.contentUrl,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdOpened={handleAdOpened}
        onAdClosed={handleAdClosed}
        onAdClicked={handleAdClicked}
        onAdImpression={handleAdImpression}
        style={[
          styles.bannerAd,
          { 
            opacity: adLoaded ? 1 : 0,
            height: adLoaded ? 'auto' : 0,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E6',
    width: '100%',
    overflow: 'hidden',
    marginVertical: 4,
  },
  bannerAd: {
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  webPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2AA8A8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#2AA8A8',
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#2AA8A8',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#E53E3E',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#E53E3E',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7,
  },
});