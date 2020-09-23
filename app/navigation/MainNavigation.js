import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import TempStore from '../temp_store';
import Home from '../screens/Home';
import TabNavigation from './TabNavigation';
import Add from '../screens/Add';
import Setting from '../screens/Setting';
import Update from '../screens/Update';
import SettingTabScreen from '../screens/SettingTabScreen';

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [movies, setMovies] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [books, setBooks] = useState([]);

  const [movieCheckBox, setMovieCheckBox] = useState(true);
  const [lyricsCheckBox, setLyricsCheckBox] = useState(true);
  const [bookCheckBox, setBookCheckBox] = useState(true);

  const defaultMovieBgImage = require('../assets/sky-823624_640.jpg');
  const defaultLyricsBgImage = require('../assets/kite-1666816_640.jpg');
  const defaultBookBgImage = require('../assets/maldives-2171627_640.jpg');

  const [movieSetting, setMovieSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: defaultMovieBgImage,
    bgImageBlur: 0, // 0, 0.5, 1, 1.5, 2
  });
  const [lyricsSetting, setLyricsSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: defaultLyricsBgImage,
    bgImageBlur: 0, // 0, 0.5, 1, 1.5, 2
  });
  const [bookSetting, setBookSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: defaultBookBgImage,
    bgImageBlur: 0, // 0, 0.5, 1, 1.5, 2
  });

  //각 탭의 상세 설정을 위한 임시 세팅 저장소
  const [thisMovieSetting, setThisMovieSetting] = useState({});
  const [thisLyricsSetting, setThisLyricsSetting] = useState({});
  const [thisBookSetting, setThisBookSetting] = useState({});

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

        const movie_setting = await AsyncStorage.getItem('@MovieSetting');
        if (movie_setting !== null) {
          let parsed_movie_setting = JSON.parse(movie_setting);
          if (!parsed_movie_setting.hasOwnProperty('bgImage')) {
            parsed_movie_setting.bgImage = defaultMovieBgImage;
          }
          if (!parsed_movie_setting.hasOwnProperty('bgImageBlur')) {
            parsed_movie_setting.bgImageBlur = 0;
          }
          setMovieSetting(parsed_movie_setting);
        }
        const lyrics_setting = await AsyncStorage.getItem('@LyricsSetting');
        if (lyrics_setting !== null) {
          let parsed_lyrics_setting = JSON.parse(lyrics_setting);
          if (!parsed_lyrics_setting.hasOwnProperty('bgImage')) {
            parsed_lyrics_setting.bgImage = defaultLyricsBgImage;
          }
          if (!parsed_lyrics_setting.hasOwnProperty('bgImageBlur')) {
            parsed_lyrics_setting.bgImageBlur = 0;
          }
          setLyricsSetting(parsed_lyrics_setting);
        }
        const book_setting = await AsyncStorage.getItem('@BookSetting');
        if (book_setting !== null) {
          let parsed_book_setting = JSON.parse(book_setting);
          if (!parsed_book_setting.hasOwnProperty('bgImage')) {
            parsed_book_setting.bgImage = defaultBookBgImage;
          }
          if (!parsed_book_setting.hasOwnProperty('bgImageBlur')) {
            parsed_book_setting.bgImageBlur = 0;
          }
          setBookSetting(parsed_book_setting);
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
        const book_data = await AsyncStorage.getItem('@Book');
        if (book_data !== null) {
          // value previously stored
          //console.log('books_data:', books_data);
          setBooks(JSON.parse(book_data));
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
    movieSetting,
    lyricsSetting,
    bookSetting,
    setMovieSetting,
    setLyricsSetting,
    setBookSetting,
  };

  return (
    <>
      <Store.Provider value={providerValues}>
        <TempStore.Provider
          value={{
            thisMovieSetting,
            setThisMovieSetting,
            thisLyricsSetting,
            setThisLyricsSetting,
            thisBookSetting,
            setThisBookSetting,
          }}>
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
                name="SettingTabScreen"
                component={SettingTabScreen}
                options={({route}) => ({
                  title: '배경 설정 [ ' + route.params.screenName + ' ]',
                  gestureEnabled: true,
                  gestureResponseDistance: 'horizontal',
                  gestureDirection: 'horizontal',
                })}
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
        </TempStore.Provider>
      </Store.Provider>
    </>
  );
};

export default MainNavigation;
