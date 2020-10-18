import React, {useContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CategoryNavigation from './CategoryNavigation';

import MovieNavigation from './MovieNavigation';
import LyricsNavigation from './LyricsNavigation';
import BookNavigation from './BookNavigation';

import NavIcon from '../components/NavIcon';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Store from '../store';
import Movie from '../screens/Movie';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  const {movieCheckBox, lyricsCheckBox, bookCheckBox} = useContext(Store);
  const {categories, setCategories} = useContext(Store);

  const TabName = {
    Movie: MovieNavigation,
    Lyrics: LyricsNavigation,
    Book: BookNavigation,
  };

  const TabInfo = [
    {
      checked: movieCheckBox,
      tab: TabName[Object.keys(categories[0])[0]],
      name: Object.keys(categories[0])[0],
      icon: Object.values(categories[0])[0]['icon'],
    },
    {
      checked: lyricsCheckBox,
      tab: TabName[Object.keys(categories[1])[0]],
      name: Object.keys(categories[1])[0],
      icon: Object.values(categories[1])[0]['icon'],
    },
    {
      checked: bookCheckBox,
      tab: TabName[Object.keys(categories[2])[0]],
      name: Object.keys(categories[2])[0],
      icon: Object.values(categories[2])[0]['icon'],
    },
  ];

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      backBehavior="none"
      tabBarOptions={{
        showIcon: true,
        labelStyle: {fontSize: 12},
        tabStyle: {height: 60},
      }}>
      {TabInfo.map(
        (tabObj) =>
          tabObj.checked && (
            <Tab.Screen
              key={tabObj.name}
              name={tabObj.name}
              component={CategoryNavigation}
              initialParams={{screenName: tabObj.name}}
              options={{
                tabBarIcon: ({focused}) => (
                  <NavIcon focused={focused} name={tabObj.icon} size={25} />
                ),
              }}
            />
          ),
      )}
    </Tab.Navigator>
  );
};

export default TabNavigation;
