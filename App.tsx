import React, {useEffect, useState} from 'react';
import {Appearance} from 'react-native';

import MainNavigation from './app/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';

const App = () => {
  const PremiumUser = false;
  const colorScheme = Appearance.getColorScheme();

  const [appTheme, setAppTheme] = useState(colorScheme);

  const onChangeAppTheme = () => {
    //console.log('onChangeAppTheme');
    setAppTheme(Appearance.getColorScheme());
    // Appearance.addChangeListener(({colorScheme}) => {
    //   setAppTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    //   console.log('test', appTheme);
    // });
  };

  useEffect(() => {
    const initializeAdMob = async () => {
      await setAdRequestConfig();
      const adapterStatuses = await mobileAds().initialize();
      return adapterStatuses;
    };
    initializeAdMob(); //주석 다시 살리면 async()로 바꾸기
    SplashScreen.hide();
  }, []);

  const setAdRequestConfig = async () => {
    await mobileAds().setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.G,

      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: false,

      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,
    });
    // Request config successfully set!
    console.log('Show Banner!');
  };

  return (
    <SafeAreaProvider>
      <MainNavigation
        isPremiumUser={PremiumUser}
        appTheme={appTheme}
        onChangeAppTheme={onChangeAppTheme}
      />
    </SafeAreaProvider>
  );
};

export default App;
