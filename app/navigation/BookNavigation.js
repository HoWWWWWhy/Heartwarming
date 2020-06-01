import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Book from '../screens/Book';

const Stack = createStackNavigator();

const BookNavigation = ({navigation}) => {
  return (
    <>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Book"
          component={Book}
          initialParams={{itemId: 0}}
        />
      </Stack.Navigator>
    </>
  );
};

export default BookNavigation;
