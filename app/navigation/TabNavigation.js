import React, {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CategoryNavigation from './CategoryNavigation';

import NavIcon from '../components/NavIcon';
import {TapGestureHandler} from 'react-native-gesture-handler';
import constants from '../constants';
import Store from '../store';
import appStyles from '../styles';

const Tab = createMaterialTopTabNavigator();

const TabNavigation = () => {
  const {categories, setCategories} = useContext(Store);

  const checkedCategories = categories.filter(
    (category, idx) => Object.values(category)[0]['setting'].isSelected,
  );

  let TabInfo = checkedCategories.map(function (category) {
    return {
      checked: Object.values(category)[0]['setting'].isSelected,
      name: Object.keys(category)[0],
      icon: Object.values(category)[0]['icon'],
    };
  });

  TabInfo = TabInfo.slice(0, 5);

  return TabInfo.length > 0 ? (
    <Tab.Navigator
      tabBarPosition="bottom"
      backBehavior="none"
      screenOptions={{
        tabBarShowIcon: true,
        tabBarLabelStyle: {fontSize: 10},
        tabBarStyle: {
          paddingVertical: 5,
          height: constants.TAB_BAR_HEIGHT,
          justifyContent: 'center',
        },
        swipeEnabled: false,
      }}>
      {TabInfo.map(
        tabObj =>
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
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>선택된 카테고리가 없습니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default TabNavigation;
