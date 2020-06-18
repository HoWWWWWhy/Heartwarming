import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import constants from '../constants';
import Home from './Home';
import Store from '../store';

const Setting = ({navigation}) => {
  /*
  useEffect(() => {
    console.log('go to home');
    //navigation.navigate(Home);
  }, []);
*/
  const {movieCheckBox, setMovieCheckBox} = useContext(Store);
  const {lyricsCheckBox, setLyricsCheckBox} = useContext(Store);
  const {bookCheckBox, setBookCheckBox} = useContext(Store);

  const storeData = async () => {
    await AsyncStorage.setItem(
      '@CheckBoxState',
      JSON.stringify([movieCheckBox, lyricsCheckBox, bookCheckBox]),
    );
    navigation.navigate(Home);
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <Text style={styles.menuText}>Show Category</Text>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={movieCheckBox}
            onValueChange={() =>
              movieCheckBox ? setMovieCheckBox(false) : setMovieCheckBox(true)
            }
          />
          <Text style={styles.checkboxText}>Movie</Text>
        </View>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={lyricsCheckBox}
            onValueChange={() =>
              lyricsCheckBox
                ? setLyricsCheckBox(false)
                : setLyricsCheckBox(true)
            }
          />
          <Text style={styles.checkboxText}>Lyrics</Text>
        </View>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={bookCheckBox}
            onValueChange={() =>
              bookCheckBox ? setBookCheckBox(false) : setBookCheckBox(true)
            }
          />
          <Text style={styles.checkboxText}>Book</Text>
        </View>
        <View style={styles.container} />
      </View>

      <TouchableOpacity style={styles.setButton} onPress={storeData}>
        <Text style={styles.textButton}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#dfe6e9',
    width: constants.width,
    paddingLeft: 30,
    paddingRight: 30,
  },
  menuText: {
    fontSize: 18,
  },
  checkboxContainer: {
    marginTop: 20,
    height: 150,
  },
  checkbox: {
    flexDirection: 'row',
    //backgroundColor: 'grey',
    alignItems: 'center',
    width: 300,
    height: 30,
    margin: 5,
  },
  checkboxText: {
    fontSize: 16,
  },
  setButton: {
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Setting;
