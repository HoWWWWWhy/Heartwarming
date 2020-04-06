import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Movie from '../screens/Movie';
import Lyrics from '../screens/Lyrics';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Movie" component={Movie} />
      <Tab.Screen name="Lyrics" component={Lyrics} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
