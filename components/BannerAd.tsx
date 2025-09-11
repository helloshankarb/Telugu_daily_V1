import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { getAdUnitId, AD_CONFIG } from '@/constants/AdConfig';

// Only import AdMob components on native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== 'web') {
  const adMobModule = require('react-native-google-mobile-ads');
  BannerAd = adMobModule.BannerAd;
  BannerAdSize = adMobModule.BannerAdSize;
}

interface BannerAdComponentProps {
  adUnitId?: string;
  size?: any;
}

export default function BannerAdComponent({ 
  adUnitId, 
  size 
}: BannerAdComponentProps) {
  // Don't render ads on web platform
  if (Platform.OS === 'web') {
    // Show placeholder on web for testing
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.placeholderText}>📱 Banner Ad (Mobile Only)</Text>
      </View>
    );
  }

  const defaultSize = BannerAdSize?.BANNER || 'BANNER';
  const finalAdUnitId = adUnitId || getAdUnitId('banner');
  const finalSize = size || defaultSize;

  console.log('Rendering BannerAd with unitId:', finalAdUnitId);
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={finalAdUnitId}
        size={finalSize}
        requestOptions={AD_CONFIG.requestConfig}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E1E1E6',
  },
  webPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
});