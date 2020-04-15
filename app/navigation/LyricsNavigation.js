import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Lyrics from '../screens/Lyrics';

const Stack = createStackNavigator();

const LyricsNavigation = ({navigation}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Lyrics"
          component={Lyrics}
          initialParams={{itemId: 0}}
        />
      </Stack.Navigator>
    </>
  );
};

export default LyricsNavigation;
