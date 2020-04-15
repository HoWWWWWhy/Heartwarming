import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import Home from '../screens/Home';
import TabNavigation from './TabNavigation';
import Add from '../screens/Add';

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [movies, setMovies] = useState([]);
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const movie_data = await AsyncStorage.getItem('@Movie');
        if (movie_data !== null) {
          // value previously stored
          console.log('movie_data:', movie_data);
          setMovies(JSON.parse(movie_data));
        }
        const lyrics_data = await AsyncStorage.getItem('@Lyrics');
        if (lyrics_data !== null) {
          // value previously stored
          console.log('lyrics_data:', lyrics_data);
          setLyrics(JSON.parse(lyrics_data));
        }
      } catch (e) {
        // error reading value
        console.log('error:', e);
      }
    };
    getData();
  }, []);

  const providerValues = {
    movies,
    lyrics,
  };
  return (
    <>
      <Store.Provider value={providerValues}>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="Add"
              component={Add}
              options={{
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="TabNavigation"
              component={TabNavigation}
              options={{
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'horizontal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Store.Provider>
    </>
  );
};

export default MainNavigation;
