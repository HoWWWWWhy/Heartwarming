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

const Update = ({navigation, route}) => {
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in'];
  const [preposIndex, setProposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');
  const categoryList = ['Movie', 'Lyrics', 'Book'];
  const [category, setCategory] = useState(categoryList[0]);

  const {movies, setMovies} = useContext(Store);
  const {lyrics, setLyrics} = useContext(Store);
  const {books, setBooks} = useContext(Store);

  const {itemId, screenName} = route.params;

  useEffect(() => {
    setCategory(screenName);
    switch (screenName) {
      case 'Movie':
        setContents(movies[itemId].contents);
        if (
          preposList.indexOf(movies[itemId].prepos) % preposList.length >
          preposList.length - 2
        ) {
          setProposIndex(0);
        } else {
          setProposIndex(preposList.indexOf(movies[itemId].prepos) + 1);
        }
        setPrepos(movies[itemId].prepos);
        setSource(movies[itemId].source);
        break;

      case 'Lyrics':
        setContents(lyrics[itemId].contents);
        if (
          preposList.indexOf(lyrics[itemId].prepos) % preposList.length >
          preposList.length - 2
        ) {
          setProposIndex(0);
        } else {
          setProposIndex(preposList.indexOf(lyrics[itemId].prepos) + 1);
        }
        setPrepos(lyrics[itemId].prepos);
        setSource(lyrics[itemId].source);
        break;

      case 'Book':
        setContents(books[itemId].contents);
        if (
          preposList.indexOf(books[itemId].prepos) % preposList.length >
          preposList.length - 2
        ) {
          setProposIndex(0);
        } else {
          setProposIndex(preposList.indexOf(books[itemId].prepos) + 1);
        }
        setPrepos(books[itemId].prepos);
        setSource(books[itemId].source);
        break;
      default:
    }
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
          if (screenName === category) {
            movies.splice(itemId, 1, new_data);

            await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
            setMovies(movies);
            console.log('movies:', movies);
          } else {
            switch (screenName) {
              case 'Lyrics':
                lyrics.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
                setLyrics(lyrics);

                movies.push(new_data); //add to current list
                await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
                setMovies(movies);
                break;
              case 'Book':
                books.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Book', JSON.stringify(books));
                setBooks(books);

                movies.push(new_data); //add to current list
                await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
                setMovies(movies);
                break;
              default:
            }
          }
          break;
        case 'Lyrics':
          if (screenName === category) {
            lyrics.splice(itemId, 1, new_data);

            await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
            setLyrics(lyrics);
            console.log('lyrics:', lyrics);
          } else {
            switch (screenName) {
              case 'Movie':
                movies.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
                setMovies(movies);

                lyrics.push(new_data); //add to current list
                await AsyncStorage.setItem('@Movie', JSON.stringify(lyrics));
                setLyrics(lyrics);
                break;
              case 'Book':
                books.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Book', JSON.stringify(books));
                setBooks(books);

                lyrics.push(new_data); //add to current list
                await AsyncStorage.setItem('@Movie', JSON.stringify(lyrics));
                setLyrics(lyrics);
                break;
              default:
            }
          }
          break;
        case 'Book':
          if (screenName === category) {
            books.splice(itemId, 1, new_data);

            await AsyncStorage.setItem('@Book', JSON.stringify(books));
            setBooks(books);
            console.log('books:', books);
          } else {
            switch (screenName) {
              case 'Movie':
                movies.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
                setMovies(movies);

                books.push(new_data); //add to current list
                await AsyncStorage.setItem('@Book', JSON.stringify(books));
                setBooks(books);
                break;
              case 'Lyrics':
                lyrics.splice(itemId, 1); //delete from previous list
                await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
                setLyrics(lyrics);

                books.push(new_data); //add to current list
                await AsyncStorage.setItem('@Book', JSON.stringify(books));
                setBooks(books);
                break;
              default:
            }
          }
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
        <Text style={styles.textTitle}>Saying...</Text>
        <TextInput
          style={styles.textInput}
          value={contents}
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
          value={source}
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
        <TouchableOpacity style={styles.updateButton} onPress={storeData}>
          <Text style={styles.textButton}>수정하기</Text>
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
  updateButton: {
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

export default Update;
