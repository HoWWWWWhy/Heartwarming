import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import Home from '../screens/Home';
import TabNavigation from './TabNavigation';
import Add from '../screens/Add';
import Setting from '../screens/Setting';
import Update from '../screens/Update';

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [movies, setMovies] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [books, setBooks] = useState([]);

  const [movieCheckBox, setMovieCheckBox] = useState(true);
  const [lyricsCheckBox, setLyricsCheckBox] = useState(true);
  const [bookCheckBox, setBookCheckBox] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const checkbox_states = await AsyncStorage.getItem('@CheckBoxState');
        //console.log(checkbox_states);
        if (checkbox_states !== null) {
          setMovieCheckBox(JSON.parse(checkbox_states)[0]);
          setLyricsCheckBox(JSON.parse(checkbox_states)[1]);
          setBookCheckBox(JSON.parse(checkbox_states)[2]);
        }

        const movie_data = await AsyncStorage.getItem('@Movie');
        if (movie_data !== null) {
          // value previously stored
          //console.log('movie_data:', movie_data);
          setMovies(JSON.parse(movie_data));
        }
        const lyrics_data = await AsyncStorage.getItem('@Lyrics');
        if (lyrics_data !== null) {
          // value previously stored
          //console.log('lyrics_data:', lyrics_data);
          setLyrics(JSON.parse(lyrics_data));
        }
        const books_data = await AsyncStorage.getItem('@Book');
        if (books_data !== null) {
          // value previously stored
          //console.log('books_data:', books_data);
          setBooks(JSON.parse(books_data));
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
    books,
    setMovies,
    setLyrics,
    setBooks,
    movieCheckBox,
    lyricsCheckBox,
    bookCheckBox,
    setMovieCheckBox,
    setLyricsCheckBox,
    setBookCheckBox,
  };

  return (
    <>
      <Store.Provider value={providerValues}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Setting"
              component={Setting}
              options={{
                title: '설정하기',
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="Add"
              component={Add}
              options={{
                title: '추가하기',
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="Update"
              component={Update}
              options={{
                title: '수정하기',
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="TabNavigation"
              component={TabNavigation}
              options={{
                title: 'View',
                headerShown: false,
                gestureEnabled: true,
                gestureResponseDistance: 'horizontal',
                gestureDirection: 'vertical',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Store.Provider>
    </>
  );
};

export default MainNavigation;
