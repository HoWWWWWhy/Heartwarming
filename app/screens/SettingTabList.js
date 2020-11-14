import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

import constants from '../constants';
import Home from './Home';
import Store from '../store';
import TempStore from '../temp_store';

const SettingTabList = ({navigation}) => {
  const {categories, setCategories} = useContext(Store);

  const DATA = categories.map((category, idx) => ({
    id: `setting-${Object.keys(category)[0]}`,
    title: Object.keys(category)[0],
  }));

  const {movieCheckBox, setMovieCheckBox} = useContext(Store);
  const {lyricsCheckBox, setLyricsCheckBox} = useContext(Store);
  const {bookCheckBox, setBookCheckBox} = useContext(Store);

  const {movieSetting, setMovieSetting} = useContext(Store);
  const {lyricsSetting, setLyricsSetting} = useContext(Store);
  const {bookSetting, setBookSetting} = useContext(Store);

  const {thisMovieSetting, setThisMovieSetting} = useContext(TempStore);
  const {thisLyricsSetting, setThisLyricsSetting} = useContext(TempStore);
  const {thisBookSetting, setThisBookSetting} = useContext(TempStore);

  // 아직 저장되지 않은 state 관리
  const [thisMovieCheckBox, setThisMovieCheckBox] = useState(movieCheckBox);
  const [thisLyricsCheckBox, setThisLyricsCheckBox] = useState(lyricsCheckBox);
  const [thisBookCheckBox, setThisBookCheckBox] = useState(bookCheckBox);

  const settingEditIcon = {
    name: 'edit',
    color: '#535c68',
  };

  useEffect(() => {
    return () => {
      console.log(categories);
      console.log('cleanup');
      setThisMovieSetting({});
      setThisLyricsSetting({});
      setThisBookSetting({});
    };
  }, []);

  const Item = ({title}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>

      <View style={styles.buttonContainer}>
        <CheckBox
          disabled={false}
          value={thisMovieCheckBox}
          onValueChange={() =>
            thisMovieCheckBox
              ? setThisMovieCheckBox(false)
              : setThisMovieCheckBox(true)
          }
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditTabScreen', {screenName: title})
          }>
          <Icon
            name={settingEditIcon.name}
            size={25}
            color={settingEditIcon.color}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const storeData = async () => {
    if (thisMovieCheckBox | thisLyricsCheckBox | thisBookCheckBox) {
      try {
        await AsyncStorage.setItem(
          '@CheckBoxState',
          JSON.stringify([
            thisMovieCheckBox,
            thisLyricsCheckBox,
            thisBookCheckBox,
          ]),
        );
        if (Object.keys(thisMovieSetting).length > 0) {
          await AsyncStorage.setItem(
            '@MovieSetting',
            JSON.stringify(thisMovieSetting),
          );
          setMovieSetting(thisMovieSetting);
        }
        if (Object.keys(thisLyricsSetting).length > 0) {
          await AsyncStorage.setItem(
            '@LyricsSetting',
            JSON.stringify(thisLyricsSetting),
          );
          setLyricsSetting(thisLyricsSetting);
        }
        if (Object.keys(thisBookSetting).length > 0) {
          await AsyncStorage.setItem(
            '@BookSetting',
            JSON.stringify(thisBookSetting),
          );
          setBookSetting(thisBookSetting);
        }
      } catch (e) {
        // saving error
        console.log(e);
      }

      setMovieCheckBox(thisMovieCheckBox);
      setLyricsCheckBox(thisLyricsCheckBox);
      setBookCheckBox(thisBookCheckBox);

      navigation.navigate('Home');
    } else {
      Alert.alert('알림', '최소 한 개의 카테고리를 선택해 주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Item title={item.title} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#f1f2f6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
  },
  checkbox: {
    flexDirection: 'row',
    //backgroundColor: 'grey',
    alignItems: 'center',
    width: 80,
    height: 30,
    marginVertical: 3,
    marginLeft: 3,
    marginRight: 5,
  },
  checkboxText: {
    fontSize: 16,
  },
  settingEdit: {
    //marginLeft: 10,
    //paddingTop: 3,
    height: 30,
    //backgroundColor: 'black',
  },
  setButton: {
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 50,
    //marginHorizontal: 30,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingTabList;
