import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import constants from '../constants';
import Home from './Home';
import Store from '../store';

const Setting = ({navigation}) => {
  const {movieCheckBox, setMovieCheckBox} = useContext(Store);
  const {lyricsCheckBox, setLyricsCheckBox} = useContext(Store);
  const {bookCheckBox, setBookCheckBox} = useContext(Store);

  const [thisMovieCheckBox, setThisMovieCheckBox] = useState(movieCheckBox);
  const [thisLyricsCheckBox, setThisLyricsCheckBox] = useState(lyricsCheckBox);
  const [thisBookCheckBox, setThisBookCheckBox] = useState(bookCheckBox);

  const storeData = async () => {
    if (thisMovieCheckBox | thisLyricsCheckBox | thisBookCheckBox) {
      await AsyncStorage.setItem(
        '@CheckBoxState',
        JSON.stringify([
          thisMovieCheckBox,
          thisLyricsCheckBox,
          thisBookCheckBox,
        ]),
      );
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
      <View style={styles.checkboxContainer}>
        <Text style={styles.menuText}>탭 표시 설정</Text>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={thisMovieCheckBox}
            onValueChange={() =>
              thisMovieCheckBox
                ? setThisMovieCheckBox(false)
                : setThisMovieCheckBox(true)
            }
          />
          {/*<Text style={styles.checkboxText}>Movie</Text>*/}
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SettingTabScreen', {screenName: 'Movie'})
              }>
              <Text style={styles.checkboxText}>Movie</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={thisLyricsCheckBox}
            onValueChange={() =>
              thisLyricsCheckBox
                ? setThisLyricsCheckBox(false)
                : setThisLyricsCheckBox(true)
            }
          />
          <Text style={styles.checkboxText}>Lyrics</Text>
        </View>
        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={thisBookCheckBox}
            onValueChange={() =>
              thisBookCheckBox
                ? setThisBookCheckBox(false)
                : setThisBookCheckBox(true)
            }
          />
          <Text style={styles.checkboxText}>Book</Text>
        </View>
        <View style={styles.container} />
      </View>
      <View style={styles.helpContainer}>
        <Text style={styles.menuText}>도움말</Text>
        <Text style={styles.helpText}>
          {`[View]에서는 화면의 맨 위쪽 부분을 살짝 위에서 아래로 
쓸어내려주시면 메뉴 화면으로 갈 수 있습니다.`}
        </Text>
      </View>
      <TouchableOpacity style={styles.setButton} onPress={storeData}>
        <Text style={styles.textButton}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#dfe6e9',
    width: constants.width,
    paddingLeft: 30,
    paddingRight: 30,
  },
  menuText: {
    fontSize: 18,
    marginBottom: 10,
  },
  helpContainer: {
    marginBottom: 20,
  },
  helpText: {
    fontSize: 14,
  },
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    //backgroundColor: 'grey',
    alignItems: 'center',
    width: 300,
    height: 30,
    margin: 5,
  },
  checkboxText: {
    fontSize: 16,
  },
  setButton: {
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

export default Setting;
