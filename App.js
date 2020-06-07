import React, {useEffect} from 'react';
import MainNavigation from './app/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    /*
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    */
    SplashScreen.hide();
  }, []);
  return <MainNavigation />;
};

export default App;
