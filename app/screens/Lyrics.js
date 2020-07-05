import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import Card from '../components/Card';
import FloatingActionButton from '../components/FloatingActionButton';

const Lyrics = ({route, navigation}) => {
  const {lyrics, setLyrics} = useContext(Store);
  const {itemId} = route.params;

  const bgImage = require('../assets/kite-1666816_640.jpg');
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
    //console.log(Object.values(lyrics));
    if (lyrics.length > 0) {
      setContents(lyrics[itemId].contents);
      setPrepos(lyrics[itemId].prepos);
      setSource(lyrics[itemId].source);
      if (itemId === 0) {
        setPrevButtonDisable(true);
        setPrevButtonColor(buttonColor.inactive);
      } else {
        setPrevButtonDisable(false);
        setPrevButtonColor(buttonColor.active);
      }
      if (itemId === lyrics.length - 1) {
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
  }, [itemId, Object.values(lyrics)]);

  const setPrevItemId = () => {
    let prevId = itemId - 1;
    if (prevId < 0) {
      prevId = 0;
    }
    return prevId;
  };

  const setNextItemId = () => {
    let nextId = itemId + 1;
    if (lyrics.length === 0) {
      nextId = 0;
    } else if (nextId > lyrics.length - 1) {
      nextId = lyrics.length - 1;
    }
    return nextId;
  };

  const storeData = async data => {
    try {
      await AsyncStorage.setItem('@Lyrics', JSON.stringify(data));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const onCreate = () => {
    navigation.navigate('Add', {itemId: itemId, screenName: 'Lyrics'});
  };

  const onUpdate = () => {
    navigation.navigate('Update', {itemId: itemId, screenName: 'Lyrics'});
  };

  const onDelete = () => {
    if (lyrics.length > 0) {
      lyrics.splice(itemId, 1);
      //console.log(JSON.stringify(lyrics));
      storeData(lyrics);
      setLyrics(lyrics);
      if (lyrics.length === itemId && lyrics.length > 0) {
        //맨 끝 아이템을 삭제한 경우
        navigation.navigate('Lyrics', {itemId: itemId - 1});
      } else {
        navigation.navigate('Lyrics', {itemId: itemId});
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
              navigation.navigate('Lyrics', {itemId: setPrevItemId()})
            }>
            <Icon name="chevron-left" size={40} color={prevButtonColor} />
          </TouchableOpacity>

          <Card contents={contents} prepos={prepos} source={source} />

          <TouchableOpacity
            disabled={nextButtonDisable}
            onPress={() =>
              navigation.navigate('Lyrics', {itemId: setNextItemId()})
            }>
            <Icon name="chevron-right" size={40} color={nextButtonColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.menuButton}>
          <FloatingActionButton
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            updateDisabled={lyrics.length > 0 ? false : true}
            deleteDisabled={lyrics.length > 0 ? false : true}
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

export default Lyrics;
