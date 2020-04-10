import React from 'react';
import {View, Text} from 'react-native';
import MenuButton from '../components/MenuButton';
import TabNavigation from '../navigation/TabNavigation';

const Home = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MenuButton
        text="Setting"
        onPress={() => navigation.navigate(TabNavigation)}
        bgColor="red"
        textColor="white"
      />
      <MenuButton
        text="Add Words"
        onPress={() => navigation.navigate(TabNavigation)}
        bgColor="yellow"
        textColor="black"
      />
      <MenuButton
        text="View"
        onPress={() => navigation.navigate(TabNavigation)}
        bgColor="green"
        textColor="white"
      />
    </View>
  );
};

export default Home;
