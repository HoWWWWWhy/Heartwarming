import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
//import Movie from '../screens/Movie';
import MovieNavigation from './MovieNavigation';
import LyricsNavigation from './LyricsNavigation';
import BookNavigation from './BookNavigation';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="Movie" component={MovieNavigation} />
      <Tab.Screen name="Lyrics" component={LyricsNavigation} />
      <Tab.Screen name="Book" component={BookNavigation} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
