import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getAdUnitId, AD_CONFIG } from '@/constants/AdConfig';

interface BannerAdComponentProps {
  adUnitId?: string;
  size?: BannerAdSize;
}

export default function BannerAdComponent({ 
  adUnitId, 
  size = BannerAdSize.BANNER 
}: BannerAdComponentProps) {
  const finalAdUnitId = adUnitId || getAdUnitId('banner');

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={finalAdUnitId}
        size={size}
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