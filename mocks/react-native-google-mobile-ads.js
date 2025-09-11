// mocks/react-native-google-mobile-ads.js
// This file provides a mock for react-native-google-mobile-ads for web builds.

// Mock the default export (mobileAds)
const mobileAds = () => ({
  initialize: () => {
    console.warn('AdMob: initialize called on web, returning no-op.');
    return Promise.resolve();
  },
  setRequestConfiguration: (config) => {
    console.warn('AdMob: setRequestConfiguration called on web, returning no-op.', config);
    return Promise.resolve();
  },
});

// Mock BannerAd component
const BannerAd = () => {
  console.warn('AdMob: BannerAd rendered on web, returning null.');
  return null; // Render nothing on web
};

// Mock BannerAdSize and TestIds, MaxAdContentRating
const BannerAdSize = {
  BANNER: '320x50',
  LARGE_BANNER: '320x100',
  MEDIUM_RECTANGLE: '300x250',
  FULL_BANNER: '468x60',
  LEADERBOARD: '728x90',
  ADAPTIVE_BANNER: 'adaptive',
};

const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
};

const MaxAdContentRating = {
  G: 'G',
  PG: 'PG',
  T: 'T',
  MA: 'MA',
  UNSPECIFIED: 'UNSPECIFIED',
};

module.exports = {
  default: mobileAds,
  BannerAd,
  BannerAdSize,
  TestIds,
  MaxAdContentRating,
};