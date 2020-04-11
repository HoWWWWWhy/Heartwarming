import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Movie = ({navigation}) => {
  const [note, setNote] = useState('');
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key');
        if (value !== null) {
          // value previously stored
          console.log(value);
          setNote(value);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Movie Screen</Text>
      <Text>{note}</Text>
    </View>
  );
};

export default Movie;
