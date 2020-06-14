import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MovieNavigation from './MovieNavigation';
import LyricsNavigation from './LyricsNavigation';
import BookNavigation from './BookNavigation';
import NavIcon from '../components/NavIcon';
import {TapGestureHandler} from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();
const TabList = [MovieNavigation, LyricsNavigation, BookNavigation];
const TabNames = ['Movie', 'Lyrics', 'Book'];
const TabIcons = ['movie', 'library-music', 'library-books'];

const TabNavigation = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        showIcon: true,
        labelStyle: {fontSize: 12},
      }}>
      {TabList.map((tab, i) => (
        <Tab.Screen
          key={TabNames[i]}
          name={TabNames[i]}
          component={tab}
          options={{
            tabBarIcon: ({focused}) => (
              <NavIcon focused={focused} name={TabIcons[i]} size={26} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigation;
