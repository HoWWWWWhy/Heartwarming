import 'react-native-gesture-handler';
import React, {useEffect, useState, useRef} from 'react';

import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import Home from '../screens/Home';
import TabNavigation from './TabNavigation';

import Add from '../screens/Add';
import Setting from '../screens/Setting';
import Update from '../screens/Update';
import EditCategory from '../screens/EditCategory';
import EditTabScreen from '../screens/EditTabScreen';
import SettingTabList from '../screens/SettingTabList';
import Help from '../screens/Help';

import linking from '../linking';
import constants from '../constants';
import assets from '../default_assets';
import {init_categories} from '../database/schema';

import _ from 'lodash';

const Stack = createStackNavigator();

const MainNavigation = ({isPremiumUser, appTheme, onChangeAppTheme}) => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  const [categories, setCategories] = useState(init_categories);

  useEffect(() => {
    //console.log('MainNavigation Mounted');

    const storeData = async data => {
      //console.log('storeData');
      //console.log(data);
      try {
        await AsyncStorage.setItem('@Data', JSON.stringify(data));
      } catch (err) {
        // saving error
        console.log(err);
      }
    };

    const getData = async () => {
      try {
        const all_data = await AsyncStorage.getItem('@Data');
        if (all_data !== null) {
          // value previously stored
          //console.log('all_data:', all_data);
          console.log('all_data:', JSON.parse(all_data));
          setCategories(JSON.parse(all_data));
          //await AsyncStorage.removeItem('@Data');
        } else {
          //for old versions (<= 1.3.0)
          let newData = _.cloneDeep(categories);
          const checkbox_states = await AsyncStorage.getItem('@CheckBoxState');
          //console.log(checkbox_states);

          const movie_data = await AsyncStorage.getItem('@Movie');
          if (movie_data !== null) {
            // value previously stored
            //console.log('movie_data:', movie_data);

            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Movie',
            );
            newData[newIdx]['Movie']['data'] = JSON.parse(movie_data);
            //setMovies(JSON.parse(movie_data));
          }
          const movie_setting = await AsyncStorage.getItem('@MovieSetting');
          if (movie_setting !== null) {
            //console.log('movie_setting:', movie_setting);
            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Movie',
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
            if (checkbox_states !== null) {
              newData[newIdx]['Movie']['setting'].isSelected = JSON.parse(
                checkbox_states,
              )[0];
            }
            //setMovieSetting(parsed_movie_setting);
          }

          const lyrics_data = await AsyncStorage.getItem('@Lyrics');
          if (lyrics_data !== null) {
            // value previously stored
            //console.log('lyrics_data:', lyrics_data);

            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Lyrics',
            );
            newData[newIdx]['Lyrics']['data'] = JSON.parse(lyrics_data);
            //setLyrics(JSON.parse(lyrics_data));
          }
          const lyrics_setting = await AsyncStorage.getItem('@LyricsSetting');
          if (lyrics_setting !== null) {
            //console.log('lyrics_setting:', lyrics_setting);
            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Lyrics',
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
            if (checkbox_states !== null) {
              newData[newIdx]['Lyrics']['setting'].isSelected = JSON.parse(
                checkbox_states,
              )[1];
            }
            //setLyricsSetting(parsed_lyrics_setting);
          }
          const book_data = await AsyncStorage.getItem('@Book');
          if (book_data !== null) {
            // value previously stored
            //console.log('book_data:', book_data);

            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Book',
            );
            newData[newIdx]['Book']['data'] = JSON.parse(book_data);
            //setBooks(JSON.parse(book_data));
          }
          const book_setting = await AsyncStorage.getItem('@BookSetting');
          if (book_setting !== null) {
            //console.log('book_setting:', book_setting);

            const newIdx = newData.findIndex(
              category => Object.keys(category)[0] === 'Book',
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
            if (checkbox_states !== null) {
              newData[newIdx]['Book']['setting'].isSelected = JSON.parse(
                checkbox_states,
              )[2];
            }
            //setBookSetting(parsed_book_setting);
          }
          setCategories(newData);
          storeData(newData);
        }
      } catch (err) {
        // error reading value
        console.log('error:', err);
      }
    };
    getData();
  }, []);

  const providerValues = {
    categories,
    setCategories,
    isPremiumUser,
    appTheme,
    onChangeAppTheme,
  };

  return (
    <>
      <Store.Provider value={providerValues}>
        <NavigationContainer
          linking={linking}
          ref={navigationRef}
          onReady={() =>
            (routeNameRef.current = navigationRef.current.getCurrentRoute()?.name)
          }
          onStateChange={() => {
            //console.log('onStateChange:', state);
            const previousRouteName = routeNameRef.current;
            //const currentRoute = navigationRef.getCurrentRoute();
            const currentRouteName = navigationRef.getCurrentRoute().name;
            //console.log('previousRouteName:', previousRouteName);
            //console.log('currentRouteName:', currentRouteName);
            //console.log('currentRoute:', currentRoute);
            if (previousRouteName !== currentRouteName) {
              //console.log('currentRouteName:', currentRouteName);
              analytics().logScreenView({
                screen_class: currentRouteName,
                screen_name: currentRouteName,
              });
              //analytics().setCurrentScreen(currentRouteName, currentRouteName);
            }
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }}>
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
                gestureDirection: 'horizontal',
                headerStyle: {height: constants.STACK_HEADER_HEIGHT},
              }}
            />
            <Stack.Screen
              name="Help"
              component={Help}
              options={{
                title: '도움말',
                //gestureEnabled: true,
                //gestureDirection: 'horizontal',
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
