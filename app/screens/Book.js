import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ImageBackground, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import Card from '../components/Card';
import FloatingActionButton from '../components/FloatingActionButton';

const Book = ({route, navigation}) => {
  const {books, setBooks} = useContext(Store);
  const {itemId} = route.params;

  const bgImage = require('../assets/maldives-2171627_640.jpg');
  const buttonColor = {active: 'black', inactive: 'darkgrey'};

  const [contents, setContents] = useState('');
  const [prepos, setPrepos] = useState('No Contents');
  const [source, setSource] = useState('');

  const [prevButtonDisable, setPrevButtonDisable] = useState(false);
  const [prevButtonColor, setPrevButtonColor] = useState(buttonColor.active);
  const [nextButtonDisable, setNextButtonDisable] = useState(false);
  const [nextButtonColor, setNextButtonColor] = useState(buttonColor.active);

  useEffect(() => {
    //console.log('useEffect', itemId);
    //console.log(Object.values(books));
    if (books.length > 0) {
      setContents(books[itemId].contents);
      setPrepos(books[itemId].prepos);
      setSource(books[itemId].source);
      if (itemId === 0) {
        setPrevButtonDisable(true);
        setPrevButtonColor(buttonColor.inactive);
      } else {
        setPrevButtonDisable(false);
        setPrevButtonColor(buttonColor.active);
      }
      if (itemId === books.length - 1) {
        setNextButtonDisable(true);
        setNextButtonColor(buttonColor.inactive);
      } else {
        setNextButtonDisable(false);
        setNextButtonColor(buttonColor.active);
      }
    } else {
      setContents('');
      setPrepos('No Contents');
      setSource('');
      setPrevButtonDisable(true);
      setPrevButtonColor(buttonColor.inactive);
      setNextButtonDisable(true);
      setNextButtonColor(buttonColor.inactive);
    }
  }, [itemId, Object.values(books)]);

  const setPrevItemId = () => {
    let prevId = itemId - 1;
    if (prevId < 0) {
      prevId = 0;
    }
    return prevId;
  };

  const setNextItemId = () => {
    let nextId = itemId + 1;
    if (books.length === 0) {
      nextId = 0;
    } else if (nextId > books.length - 1) {
      nextId = books.length - 1;
    }
    return nextId;
  };

  const storeData = async data => {
    try {
      await AsyncStorage.setItem('@Book', JSON.stringify(data));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const onCreate = () => {
    navigation.navigate('Add', {itemId: itemId, screenName: 'Book'});
  };

  const onUpdate = () => {
    navigation.navigate('Update', {itemId: itemId, screenName: 'Book'});
  };

  const onDelete = () => {
    //Alert.alert('delete:' + itemId + JSON.stringify(books[itemId]));
    if (books.length > 0) {
      books.splice(itemId, 1);
      //console.log(JSON.stringify(books));
      storeData(books);
      setBooks(books);
      if (books.length === itemId && books.length > 0) {
        //맨 끝 아이템을 삭제한 경우
        navigation.navigate('Book', {itemId: itemId - 1});
      } else {
        //console.log('same id');
        navigation.navigate('Book', {itemId: itemId});
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.image}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            disabled={prevButtonDisable}
            onPress={() =>
              navigation.navigate('Book', {itemId: setPrevItemId()})
            }>
            <Icon name="chevron-left" size={40} color={prevButtonColor} />
          </TouchableOpacity>

          <Card contents={contents} prepos={prepos} source={source} />

          <TouchableOpacity
            disabled={nextButtonDisable}
            onPress={() =>
              navigation.navigate('Book', {itemId: setNextItemId()})
            }>
            <Icon name="chevron-right" size={40} color={nextButtonColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.menuButton}>
          <FloatingActionButton
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuButton: {
    flex: 1,
    bottom: 20,
    left: 150,
  },
});

export default Book;
