import React from 'react';
import { View, StyleSheet, Platform, Text, Dimensions, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
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

  // Use standard banner size for better ad fill rate
  const defaultSize = BannerAdSize.BANNER;
  const finalAdUnitId = adUnitId || getAdUnitId('banner');
  const finalSize = size || defaultSize;

  console.log('Rendering BannerAd with unitId:', finalAdUnitId, 'size:', finalSize);
  
  return (
    <View style={styles.container}>
      {isLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2AA8A8" />
          <Text style={styles.loadingText}>Loading ad...</Text>
        </View>
      )}
      
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad failed to load</Text>
        </View>
      )}
      
      <BannerAd
        unitId={finalAdUnitId}
        size={finalSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['education', 'language', 'learning', 'telugu'],
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
          setIsLoading(false);
          setHasError(false);
          onAdLoaded?.();
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          setIsLoading(false);
          setHasError(true);
          onAdFailedToLoad?.(error);
        }}
        onAdOpened={() => {
          console.log('Banner ad opened');
        }}
        onAdClosed={() => {
          console.log('Banner ad closed');
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E6',
    width: '100%',
    overflow: 'hidden',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
  },
  webPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
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
    minHeight: 50,
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