import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, View, Text} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Home from './Home';

const Add = ({navigation}) => {
  const defaultContents =
    'If someone is nice to you but rude to the waiter, they are not a nice person.';
  const defaultSource = 'The Waiter Rule';
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in'];
  const [preposIndex, setProposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');
  const categoryList = ['Movie', 'Lyrics'];
  const [category, setCategory] = useState(categoryList[0]);
  const [movies, setMovies] = useState([]);
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const movie_data = await AsyncStorage.getItem('@Movie');
        if (movie_data !== null) {
          // value previously stored
          setMovies(JSON.parse(movie_data));
        }
        const lyrics_data = await AsyncStorage.getItem('@Lyrics');
        if (lyrics_data !== null) {
          // value previously stored
          setLyrics(JSON.parse(lyrics_data));
        }
      } catch (e) {
        // error reading value
        console.log(e);
      }
    };

    getData();

    //console.log('old:', movies);
  }, []);

  const storeData = async () => {
    const new_data = {
      contents,
      prepos,
      source,
    };

    console.log('data:', new_data);

    try {
      switch (category) {
        case 'Movie':
          movies.push(new_data);
          await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
          console.log('movies:', movies);
          break;
        case 'Lyrics':
          lyrics.push(new_data);
          await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
          console.log('lyrics:', lyrics);
          break;
        default:
      }

      navigation.navigate(Home);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const changeList = () => {
    //console.log(preposIndex);
    setProposIndex(prevIndex => prevIndex + 1);
    if (preposIndex % preposList.length > preposList.length - 2) {
      setProposIndex(0);
    }

    setPrepos(preposList[preposIndex]);
    //console.log(preposIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Saying...</Text>
      <TextInput
        style={styles.textInput}
        placeholder={defaultContents}
        multiline
        editable
        onChangeText={text => setContents(text)}
      />
      <TouchableOpacity onPress={changeList}>
        <Text style={styles.textTitle}>{prepos}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder={defaultSource}
        multiline
        editable
        onChangeText={text => setSource(text)}
      />
      <Text style={styles.textTitle}>Select</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
        {categoryList.map(item => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.addButton} onPress={storeData}>
        <Text>추가하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 50,
    marginTop: 50,
  },
  textTitle: {
    fontSize: 14,
    color: 'gray',
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  addButton: {
    backgroundColor: '#fab1a0',
    alignItems: 'center',
    padding: 10,
  },
});

export default Add;
