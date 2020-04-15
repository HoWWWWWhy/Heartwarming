import React, {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Store from '../store';
import Card from '../components/Card';

const Lyrics = ({route, navigation}) => {
  const {lyrics} = useContext(Store);
  console.log(lyrics.length);
  const {itemId} = route.params;

  let contents = '';
  let prepos = '';
  let source = '';
  if (lyrics.length > 0) {
    contents = lyrics[itemId].contents;
    prepos = lyrics[itemId].prepos;
    source = lyrics[itemId].source;
  }
  const setPrevItemId = () => {
    let prevId = itemId - 1;
    if (prevId < 0) {
      prevId = 0;
    }
    return prevId;
  };

  const setNextItemId = () => {
    let nextId = itemId + 1;
    if (nextId > lyrics.length - 1) {
      nextId = lyrics.length - 1;
    }
    return nextId;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Lyrics', {itemId: setPrevItemId()})
        }>
        <Text>prev</Text>
      </TouchableOpacity>

      {lyrics.length === 0 ? (
        <Text>No Contents</Text>
      ) : (
        <Card contents={contents} prepos={prepos} source={source} />
      )}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Lyrics', {itemId: setNextItemId()})
        }>
        <Text>next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Lyrics;
