import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Movie from '../screens/Movie';

const Stack = createStackNavigator();

const MovieNavigation = ({navigation}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Movie"
          component={Movie}
          initialParams={{itemId: 0}}
        />
      </Stack.Navigator>
    </>
  );
};

export default MovieNavigation;
