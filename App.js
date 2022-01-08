import React, {useEffect, useState} from 'react';
import {Appearance} from 'react-native';

import MainNavigation from './app/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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
    /*
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    */
    SplashScreen.hide();
  }, []);
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
