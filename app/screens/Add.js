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
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await AsyncStorage.getItem('@storage_Key');
        if (data !== null) {
          // value previously stored
          console.log('there is data');
          setMovies(JSON.parse(data));
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
    const data = {
      contents,
      prepos,
      source,
    };
    console.log('data:', data);
    movies.push(data);
    console.log('movies:', movies);
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(movies));
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
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCategory(itemValue)
        }>
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
