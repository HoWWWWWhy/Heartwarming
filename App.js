import React, {useEffect} from 'react';
import MainNavigation from './app/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
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
      <MainNavigation />
    </SafeAreaProvider>
  );
};

export default App;
