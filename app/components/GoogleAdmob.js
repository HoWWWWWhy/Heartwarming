import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import admob, {
  MaxAdContentRating,
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@react-native-firebase/admob';
import Config from 'react-native-config';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Config.GOOGLE_ADMOB_BOTTOMBANNER_UNIT_ID;

const BannerAdMaxHeight = 100;

const MyBannerAd = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [altanativeText, setAltanativeText] = useState('');
  useEffect(() => {
    //console.log('MyBannerAd Mounted:', adUnitId);
    setAdRequestConfig();
  }, []);

  const setAdRequestConfig = async () => {
    //console.log('CALL setConfig');
    await admob().setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.G,

      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: false,

      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,
    });
    // Request config successfully set!
    //console.log('Show Banner!');
    //setShowBanner(true);
    //setAltanativeText('광고 요청 중');
  };

  return (
    <View
      style={
        showBanner ? styles.container : [styles.container, styles.blankAd]
      }>
      {showBanner ? (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.LARGE_BANNER} //Large banner: 320 x 100 density-independent pixels
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={error => {
            console.log('Advert failed to load: ', error);
            setShowBanner(false);
            setAltanativeText('광고 자리입니다.');
          }}
          onAdLoaded={() => console.log('onAdLoaded')}
        />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.textBlankAd}>{altanativeText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  blankAd: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    //paddingBottom: 45,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlankAd: {
    fontSize: 20,
  },
});

export {MyBannerAd, BannerAdMaxHeight};
