import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Movie = ({navigation}) => {
  const [contents, setContents] = useState('');
  const [prepos, setPrepos] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await AsyncStorage.getItem('@storage_Key');
        if (data !== null) {
          // value previously stored
          console.log('movie:', JSON.parse(data));
          //setContents(JSON.parse(data)['contents']);
          //setPrepos(JSON.parse(data)['prepos']);
          //setSource(JSON.parse(data)['source']);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{contents}</Text>
      <Text>
        {prepos} {source}
      </Text>
    </View>
  );
};

export default Movie;
