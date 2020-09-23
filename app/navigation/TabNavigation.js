import React, {useContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MovieNavigation from './MovieNavigation';
import LyricsNavigation from './LyricsNavigation';
import BookNavigation from './BookNavigation';
import NavIcon from '../components/NavIcon';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Store from '../store';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  const {movieCheckBox, lyricsCheckBox, bookCheckBox} = useContext(Store);

  const TabInfo = [
    {
      checked: movieCheckBox,
      tab: MovieNavigation,
      name: 'Movie',
      icon: 'movie',
    },
    {
      checked: lyricsCheckBox,
      tab: LyricsNavigation,
      name: 'Lyrics',
      icon: 'library-music',
    },
    {
      checked: bookCheckBox,
      tab: BookNavigation,
      name: 'Book',
      icon: 'library-books',
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
              component={tabObj.tab}
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
