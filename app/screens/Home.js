import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MenuButton from '../components/MenuButton';
import TabNavigation from '../navigation/TabNavigation';
import Add from '../screens/Add';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <MenuButton
        text="Setting"
        //onPress={() => navigation.navigate()}
        bgColor="#74b9ff"
        textColor="white"
      />
      <MenuButton
        text="Add Words"
        onPress={() => navigation.navigate(Add)}
        bgColor="#6c5ce7"
        textColor="white"
      />
      <MenuButton
        text="View"
        onPress={() => navigation.navigate(TabNavigation)}
        bgColor="#16a085"
        textColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dfe6e9',
  },
});

export default Home;
