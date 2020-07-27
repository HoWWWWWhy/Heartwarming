import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ImageBackground, Text} from 'react-native';

const SettingTabScreen = ({route, navigation}) => {
  const {screenName} = route.params;

  return (
    <View style={styles.container}>
      <Text>{screenName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingTabScreen;
