import React from 'react';
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
    console.log('AdMob module loaded successfully');
  } catch (error) {
    console.error('Failed to load AdMob module:', error);
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
  const screenWidth = Dimensions.get('window').width;
  
  // Don't render ads on web platform
  if (Platform.OS === 'web') {
    // Show placeholder on web for testing
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.placeholderText}>📱 Real Banner Ad</Text>
        <Text style={styles.placeholderSubtext}>This will be a real ad on mobile</Text>
      </View>
    );
  }

  // Check if AdMob components are available
  if (!BannerAd || !BannerAdSize) {
    console.error('AdMob components not available');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>AdMob not initialized</Text>
      </View>
    );
  }

  // Use adaptive banner for better performance and fill rate
  const defaultSize = BannerAdSize.ADAPTIVE_BANNER;
  const finalAdUnitId = adUnitId || getAdUnitId('banner');
  const finalSize = size || defaultSize;

  console.log('Rendering BannerAd with unitId:', finalAdUnitId, 'size:', finalSize);
  
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={finalAdUnitId}
        size={finalSize}
        requestOptions={{
          ...AD_CONFIG.requestConfig,
          networkExtras: {
            collapsible: 'bottom',
          },
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
          onAdLoaded?.();
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          onAdFailedToLoad?.(error);
        }}
        onAdOpened={() => {
          console.log('Banner ad opened');
        }}
        onAdClosed={() => {
          console.log('Banner ad closed');
        }}
        onAdClicked={() => {
          console.log('Banner ad clicked');
        }}
        onAdImpression={() => {
          console.log('Banner ad impression recorded');
        }}
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
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
});