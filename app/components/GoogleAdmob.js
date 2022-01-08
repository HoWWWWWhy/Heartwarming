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
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.G,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: false,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
        setShowBanner(true);
      });
  }, []);
  return (
    <View style={styles.container}>
      {/* <Text>광고 자리입니다.</Text> */}
      {showBanner ? (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
        />
      ) : (
        <Text>광고 자리입니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderStyle: 'solid',
    //borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export {MyBannerAd, BannerAdMaxHeight};
