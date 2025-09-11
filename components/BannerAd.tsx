import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
    return null;
  }

  const defaultSize = BannerAdSize?.BANNER || 'BANNER';
  const finalAdUnitId = adUnitId || getAdUnitId('banner');
  const finalSize = size || defaultSize;

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
    marginVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
  },
});