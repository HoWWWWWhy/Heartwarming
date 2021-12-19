import React, {useEffect} from 'react';
import MainNavigation from './app/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const PremiumUser = false;

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
      <MainNavigation isPremiumUser={PremiumUser} />
    </SafeAreaProvider>
  );
};

export default App;
