import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

import Home from './Home';
import Store from '../store';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Add = ({navigation, route}) => {
  const defaultContents =
    'If someone is nice to you but rude to the waiter, they are not a nice person.';
  const defaultSource = 'The Waiter Rule';
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in'];
  const [preposIndex, setProposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');
  const categoryList = ['Movie', 'Lyrics', 'Book'];
  const [category, setCategory] = useState(categoryList[0]);

  const [insertFlag, setInsertFlag] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [screenName, setScreenName] = useState('');

  const {movies, setMovies} = useContext(Store);
  const {lyrics, setLyrics} = useContext(Store);
  const {books, setBooks} = useContext(Store);

  useEffect(() => {
    if (typeof route.params !== 'undefined') {
      setInsertFlag(true);
      setItemId(route.params.itemId);
      setScreenName(route.params.screenName);
      setCategory(route.params.screenName);
    } else {
      //console.log('No Params');
    }
  }, [category]);

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
          if (insertFlag) {
            movies.splice(itemId, 0, new_data);
          } else {
            movies.push(new_data);
          }
          await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
          setMovies(movies);
          console.log('movies:', movies);
          break;

        case 'Lyrics':
          if (insertFlag) {
            lyrics.splice(itemId, 0, new_data);
          } else {
            lyrics.push(new_data);
          }
          await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
          setLyrics(lyrics);
          console.log('lyrics:', lyrics);
          break;

        case 'Book':
          if (insertFlag) {
            books.splice(itemId, 0, new_data);
          } else {
            books.push(new_data);
          }
          await AsyncStorage.setItem('@Book', JSON.stringify(books));
          setBooks(books);
          console.log('books:', books);
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
    <DismissKeyboard>
      <View style={styles.container}>
        <Text style={styles.textTitle}>Phrase</Text>

        <TextInput
          style={styles.textInput}
          placeholder={defaultContents}
          multiline
          editable
          returnKeyLabel="done"
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
          enabled={insertFlag ? false : true}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
          {categoryList.map(item => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.addButton} onPress={storeData}>
          <Text style={styles.textButton}>추가하기</Text>
        </TouchableOpacity>
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 0,
    height: constants.height,
    width: constants.width,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50,
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

export default Add;
