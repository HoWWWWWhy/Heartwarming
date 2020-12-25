import React from 'react';
import {View, StyleSheet} from 'react-native';
import MenuButton from '../components/MenuButton';
import appStyles from '../styles';

// import TabNavigation from '../navigation/TabNavigation';
// import Add from '../screens/Add';
// import Setting from '../screens/Setting';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <MenuButton
        text="Setting"
        onPress={() => navigation.navigate('Setting')}
        bgColor="#74b9ff"
        textColor="white"
      />
      <MenuButton
        text="Add Phrase"
        onPress={() => navigation.navigate('Add')}
        bgColor="#6c5ce7"
        textColor="white"
      />
      <MenuButton
        text="View"
        onPress={() => navigation.navigate('TabNavigation')}
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
    backgroundColor: appStyles.backgroundColor,
  },
});

export default Home;
