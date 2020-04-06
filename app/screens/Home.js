import React from 'react';
import {View, Text, Button} from 'react-native';
import TabNavigation from '../navigation/TabNavigation';

const Home = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to TabNavigation"
        onPress={() => navigation.navigate(TabNavigation)}></Button>
    </View>
  );
};

export default Home;
