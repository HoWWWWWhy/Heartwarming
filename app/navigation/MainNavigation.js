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
import EditCategory from '../screens/EditCategory';
import EditTabScreen from '../screens/EditTabScreen';
import SettingTabList from '../screens/SettingTabList';

import constants from '../constants';
import assets from '../default_assets';
import _ from 'lodash';

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [categories, setCategories] = useState([
    {
      Movie: {
        icon: 'movie',
        data: [],
        setting: {
          useBgImage: true,
          bgColor: 'white',
          textColor: 'black',
          bgImage: assets.defaultMovieBgImage,
          bgImageBlur: 0,
        },
      },
    },
    {
      Lyrics: {
        icon: 'library-music',
        data: [],
        setting: {
          useBgImage: true,
          bgColor: 'white',
          textColor: 'black',
          bgImage: assets.defaultLyricsBgImage,
          bgImageBlur: 0,
        },
      },
    },
    {
      Book: {
        icon: 'library-books',
        data: [],
        setting: {
          useBgImage: true,
          bgColor: 'white',
          textColor: 'black',
          bgImage: assets.defaultBookBgImage,
          bgImageBlur: 0,
        },
      },
    },
  ]);

  const [movies, setMovies] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [books, setBooks] = useState([]);

  const [movieCheckBox, setMovieCheckBox] = useState(true);
  const [lyricsCheckBox, setLyricsCheckBox] = useState(true);
  const [bookCheckBox, setBookCheckBox] = useState(true);

  const [movieSetting, setMovieSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: assets.defaultMovieBgImage,
    bgImageBlur: 0, // 0, 0.5, 1, 1.5, 2
  });
  const [lyricsSetting, setLyricsSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: assets.defaultLyricsBgImage,
    bgImageBlur: 0, // 0, 0.5, 1, 1.5, 2
  });
  const [bookSetting, setBookSetting] = useState({
    useBgImage: true,
    bgColor: 'white',
    textColor: 'black',
    bgImage: assets.defaultBookBgImage,
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
        const all_data = await AsyncStorage.getItem('@Data');
        if (all_data !== null) {
          // value previously stored
          console.log('all_data:', all_data);
          setCategories(JSON.parse(all_data));
          //await AsyncStorage.removeItem('@Data');
        } else {
          //for old versions (under 1.4.0)
          let newData = _.cloneDeep(categories);
          const movie_data = await AsyncStorage.getItem('@Movie');
          if (movie_data !== null) {
            // value previously stored
            console.log('movie_data:', movie_data);

            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Movie',
            );
            newData[newIdx]['Movie']['data'] = JSON.parse(movie_data);
            //setMovies(JSON.parse(movie_data));
          }
          const movie_setting = await AsyncStorage.getItem('@MovieSetting');
          if (movie_setting !== null) {
            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Movie',
            );
            newData[newIdx]['Movie']['setting'] = JSON.parse(movie_setting);
            //let parsed_movie_setting = JSON.parse(movie_setting);
            if (
              !newData[newIdx]['Movie']['setting'].hasOwnProperty('bgImage')
            ) {
              newData[newIdx]['Movie']['setting'].bgImage =
                assets.defaultMovieBgImage;
            }
            if (
              !newData[newIdx]['Movie']['setting'].hasOwnProperty('bgImageBlur')
            ) {
              newData[newIdx]['Movie']['setting'].bgImageBlur = 0;
            }
            //setMovieSetting(parsed_movie_setting);
          }

          const lyrics_data = await AsyncStorage.getItem('@Lyrics');
          if (lyrics_data !== null) {
            // value previously stored
            console.log('lyrics_data:', lyrics_data);

            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Lyrics',
            );
            newData[newIdx]['Lyrics']['data'] = JSON.parse(lyrics_data);
            //setLyrics(JSON.parse(lyrics_data));
          }
          const lyrics_setting = await AsyncStorage.getItem('@LyricsSetting');
          if (lyrics_setting !== null) {
            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Lyrics',
            );
            newData[newIdx]['Lyrics']['setting'] = JSON.parse(lyrics_setting);
            //let parsed_lyrics_setting = JSON.parse(lyrics_setting);
            if (
              !newData[newIdx]['Lyrics']['setting'].hasOwnProperty('bgImage')
            ) {
              newData[newIdx]['Lyrics']['setting'].bgImage =
                assets.defaultLyricsBgImage;
            }
            if (
              !newData[newIdx]['Lyrics']['setting'].hasOwnProperty(
                'bgImageBlur',
              )
            ) {
              newData[newIdx]['Lyrics']['setting'].bgImageBlur = 0;
            }
            //setLyricsSetting(parsed_lyrics_setting);
          }
          const book_data = await AsyncStorage.getItem('@Book');
          if (book_data !== null) {
            // value previously stored
            console.log('book_data:', book_data);

            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Book',
            );
            newData[newIdx]['Book']['data'] = JSON.parse(book_data);
            //setBooks(JSON.parse(book_data));
          }
          const book_setting = await AsyncStorage.getItem('@BookSetting');
          if (book_setting !== null) {
            console.log('book_setting:', book_setting);

            const newIdx = newData.findIndex(
              (category) => Object.keys(category)[0] === 'Book',
            );
            newData[newIdx]['Book']['setting'] = JSON.parse(book_setting);
            //let parsed_book_setting = JSON.parse(book_setting);
            if (!newData[newIdx]['Book']['setting'].hasOwnProperty('bgImage')) {
              newData[newIdx]['Book']['setting'].bgImage =
                assets.defaultBookBgImage;
            }
            if (
              !newData[newIdx]['Book']['setting'].hasOwnProperty('bgImageBlur')
            ) {
              newData[newIdx]['Book']['setting'].bgImageBlur = 0;
            }
            //setBookSetting(parsed_book_setting);
          }
          setCategories(newData);
        }
      } catch (e) {
        // error reading value
        console.log('error:', e);
      }
    };
    getData();
  }, []);

  const providerValues = {
    categories,
    setCategories,
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
            <Stack.Navigator initialRouteName="Home">
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
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
                }}
              />

              <Stack.Screen
                name="EditTabScreen"
                component={EditTabScreen}
                options={({route}) => ({
                  title: '배경 설정 [ ' + route.params.screenName + ' ]',
                  gestureEnabled: true,
                  gestureResponseDistance: 'horizontal',
                  gestureDirection: 'horizontal',
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
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
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
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
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
                }}
              />
              <Stack.Screen
                name="EditCategory"
                component={EditCategory}
                options={{
                  title: '카테고리 편집',
                  gestureEnabled: true,
                  gestureResponseDistance: 'horizontal',
                  gestureDirection: 'horizontal',
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
                }}
              />
              <Stack.Screen
                name="SettingTabList"
                component={SettingTabList}
                options={{
                  title: '탭 디자인 설정',
                  gestureEnabled: true,
                  gestureResponseDistance: 'horizontal',
                  gestureDirection: 'horizontal',
                  headerStyle: {height: constants.STACK_HEADER_HEIGHT},
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
