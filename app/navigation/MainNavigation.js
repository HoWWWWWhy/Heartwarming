import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/Home';
import TabNavigation from './TabNavigation';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={{
              gestureEnabled: true,
              gestureResponseDistance: 'horizontal',
              gestureDirection: 'horizontal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainNavigation;
