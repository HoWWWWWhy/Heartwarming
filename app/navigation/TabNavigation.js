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
  const {categories, setCategories} = useContext(Store);
  console.log(Object.values(categories[0])[0]['navi']);
  const TabInfo = [
    {
      checked: movieCheckBox,
      tab: MovieNavigation,
      name: Object.keys(categories[0])[0],
      icon: Object.values(categories[0])[0]['icon'],
    },
    {
      checked: lyricsCheckBox,
      tab: LyricsNavigation,
      name: Object.keys(categories[1])[0],
      icon: Object.values(categories[1])[0]['icon'],
    },
    {
      checked: bookCheckBox,
      tab: BookNavigation,
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
