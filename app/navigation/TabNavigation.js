import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
//import Movie from '../screens/Movie';
import MovieNavigation from './MovieNavigation';
import LyricsNavigation from './LyricsNavigation';
import BookNavigation from './BookNavigation';
import NavIcon from '../components/NavIcon';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        showIcon: true,
        labelStyle: {fontSize: 12},
      }}>
      <Tab.Screen
        name="Movie"
        component={MovieNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <NavIcon focused={focused} name="movie" size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Lyrics"
        component={LyricsNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <NavIcon focused={focused} name="library-music" size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <NavIcon focused={focused} name="library-books" size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
