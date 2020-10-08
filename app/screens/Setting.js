import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

import constants from '../constants';
import Home from './Home';
import Store from '../store';
import TempStore from '../temp_store';

const Setting = ({navigation}) => {
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

  const URL_EMAIL = 'mailto:howwwwwhy@gmail.com';
  const URL_GOOGLEPLAY =
    'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming';
  const URL_PRIVACY = 'https://howwwwwhy.github.io/Heartwarming_privacy';

  useEffect(() => {
    return () => {
      console.log(thisMovieSetting);
      setThisMovieSetting({});
      setThisLyricsSetting({});
      setThisBookSetting({});
    };
  }, []);

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

  const onPressURL = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.menuText}>탭 표시 설정</Text>
          <View style={styles.eachCheckboxContainer}>
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
              <Text style={styles.checkboxText}>Movie</Text>
            </View>
            <View style={styles.settingEdit}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SettingTabScreen', {screenName: 'Movie'})
                }>
                <Icon
                  name={settingEditIcon.name}
                  size={25}
                  color={settingEditIcon.color}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachCheckboxContainer}>
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
            <View style={styles.settingEdit}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SettingTabScreen', {
                    screenName: 'Lyrics',
                  })
                }>
                <Icon
                  name={settingEditIcon.name}
                  size={25}
                  color={settingEditIcon.color}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachCheckboxContainer}>
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
            <View style={styles.settingEdit}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SettingTabScreen', {screenName: 'Book'})
                }>
                <Icon
                  name={settingEditIcon.name}
                  size={25}
                  color={settingEditIcon.color}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.innerContainer}>
          <Text style={styles.menuText}>도움말</Text>
          <Text style={styles.helpText}>
            {`[View] 에서는 화면의 맨 위쪽 부분을 살짝 
위에서 아래로 쓸어내려주시면 메뉴 화면으로 
갈 수 있습니다.`}
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.menuText}>정보</Text>
          <View style={styles.feedback}>
            <TouchableOpacity onPress={() => onPressURL(URL_EMAIL)}>
              <Text style={styles.subMenuText}>개발자 문의 및 제안하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressURL(URL_GOOGLEPLAY)}>
              <Text style={styles.subMenuText}>Google Play 평가하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressURL(URL_GOOGLEPLAY)}>
              <Text style={styles.subMenuText}>최신 버전 확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressURL(URL_PRIVACY)}>
              <Text style={styles.subMenuText}>개인정보처리방침</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  scrollView: {
    //backgroundColor: 'pink',
  },
  innerContainer: {
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#34495e',
    //backgroundColor: 'yellow',
  },
  menuText: {
    fontSize: 16,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#34495e',
  },
  subMenuText: {
    color: 'black',
    paddingLeft: 10,
    marginVertical: 5,
    fontSize: 18,
  },
  helpText: {
    fontSize: 14,
    paddingLeft: 10,
  },
  eachCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default Setting;
