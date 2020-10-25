import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CategoryScreen from '../screens/CategoryScreen';

const Stack = createStackNavigator();

const CategoryNavigation = ({route, navigation}) => {
  const {screenName} = route.params;
  console.log('CategoryNavigation', screenName);
  return (
    <>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          initialParams={{itemId: 0, screenName}}
        />
      </Stack.Navigator>
    </>
  );
};

export default CategoryNavigation;
