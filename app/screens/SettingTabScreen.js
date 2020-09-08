import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, Switch} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import Store from '../store';
import TempStore from '../temp_store';

import BgPalette from '../components/BgPalette';
import TextPalette from '../components/TextPalette';
import constants from '../constants';

const SettingTabScreen = ({route}) => {
  const {screenName} = route.params;

  const {movieSetting, lyricsSetting, bookSetting} = useContext(Store);

  const {thisMovieSetting, setThisMovieSetting} = useContext(TempStore);
  const {thisLyricsSetting, setThisLyricsSetting} = useContext(TempStore);
  const {thisBookSetting, setThisBookSetting} = useContext(TempStore);

  useEffect(() => {
    switch (screenName) {
      case 'Movie':
        if (Object.keys(thisMovieSetting).length === 0) {
          setThisMovieSetting(movieSetting);
        }
        break;

      case 'Lyrics':
        if (Object.keys(thisLyricsSetting).length === 0) {
          setThisLyricsSetting(lyricsSetting);
        }
        break;

      case 'Book':
        if (Object.keys(thisBookSetting).length === 0) {
          setThisBookSetting(bookSetting);
        }
        break;

      default:
    }
  }, []);

  const toggleSwitch = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        setThisMovieSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        break;

      case 'Lyrics':
        setThisLyricsSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        break;

      case 'Book':
        setThisBookSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        break;

      default:
    }
  };

  const renderSwitch = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        return (
          <>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={thisMovieSetting.useBgImage ? '#fab1a0' : 'black'}
              onValueChange={() => toggleSwitch(screenName)}
              value={thisMovieSetting.useBgImage}
              style={styles.toggleSwitch}
            />
            <Text>{thisMovieSetting.useBgImage ? 'on' : 'off'}</Text>
          </>
        );

      case 'Lyrics':
        return (
          <>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={thisLyricsSetting.useBgImage ? '#fab1a0' : 'black'}
              onValueChange={() => toggleSwitch(screenName)}
              value={thisLyricsSetting.useBgImage}
              style={styles.toggleSwitch}
            />
            <Text>{thisLyricsSetting.useBgImage ? 'on' : 'off'}</Text>
          </>
        );

      case 'Book':
        return (
          <>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={thisBookSetting.useBgImage ? '#fab1a0' : 'black'}
              onValueChange={() => toggleSwitch(screenName)}
              value={thisBookSetting.useBgImage}
              style={styles.toggleSwitch}
            />
            <Text>{thisBookSetting.useBgImage ? 'on' : 'off'}</Text>
          </>
        );

      default:
    }
  };

  const renderBgPalette = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        return (
          <BgPalette
            setting={setThisMovieSetting}
            selected={thisMovieSetting.bgColor}
          />
        );

      case 'Lyrics':
        return (
          <BgPalette
            setting={setThisLyricsSetting}
            selected={thisLyricsSetting.bgColor}
          />
        );

      case 'Book':
        return (
          <BgPalette
            setting={setThisBookSetting}
            selected={thisBookSetting.bgColor}
          />
        );

      default:
    }
  };

  const renderTextPalette = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        return (
          <TextPalette
            setting={setThisMovieSetting}
            selected={thisMovieSetting.textColor}
          />
        );

      case 'Lyrics':
        return (
          <TextPalette
            setting={setThisLyricsSetting}
            selected={thisLyricsSetting.textColor}
          />
        );

      case 'Book':
        return (
          <TextPalette
            setting={setThisBookSetting}
            selected={thisBookSetting.textColor}
          />
        );

      default:
    }
  };

  const renderPreviewBox = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        return (
          <View
            style={[
              styles.previewBox,
              {backgroundColor: thisMovieSetting.bgColor},
            ]}>
            <Text
              style={[styles.previewText, {color: thisMovieSetting.textColor}]}>
              인생은 속도가 아니라 방향이다.
            </Text>
            <Text
              style={[styles.previewText, {color: thisMovieSetting.textColor}]}>
              by 괴테
            </Text>
          </View>
        );

      case 'Lyrics':
        return (
          <View
            style={[
              styles.previewBox,
              {backgroundColor: thisLyricsSetting.bgColor},
            ]}>
            <Text
              style={[
                styles.previewText,
                {color: thisLyricsSetting.textColor},
              ]}>
              인생은 속도가 아니라 방향이다.
            </Text>
            <Text
              style={[
                styles.previewText,
                {color: thisLyricsSetting.textColor},
              ]}>
              by 괴테
            </Text>
          </View>
        );

      case 'Book':
        return (
          <View
            style={[
              styles.previewBox,
              {backgroundColor: thisBookSetting.bgColor},
            ]}>
            <Text
              style={[styles.previewText, {color: thisBookSetting.textColor}]}>
              인생은 속도가 아니라 방향이다.
            </Text>
            <Text
              style={[styles.previewText, {color: thisBookSetting.textColor}]}>
              by 괴테
            </Text>
          </View>
        );

      default:
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>배경이미지 사용하기</Text>
        {renderSwitch(screenName)}
      </View>
      <View style={styles.paletteContainer}>
        <View style={styles.bgPaletteContainer}>
          <Text style={styles.text}>Select Background Color</Text>
          {renderBgPalette(screenName)}
        </View>
        <View style={styles.textPaletteContainer}>
          <Text style={styles.text}>Select Text Color</Text>
          {renderTextPalette(screenName)}
        </View>
        <View style={styles.previewContainer}>
          <Text style={styles.text}>미리보기 (preview)</Text>
          {renderPreviewBox(screenName)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 16,
    //backgroundColor: 'yellow',
  },
  text: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingTop: 5,
    alignContent: 'center',
    //backgroundColor: 'red',
  },
  toggleSwitch: {
    marginHorizontal: 5,
    transform: [{scaleX: 1.0}, {scaleY: 1.0}],
    //backgroundColor: 'yellow',
  },
  paletteContainer: {
    flex: 1,
    //backgroundColor: 'skyblue',
  },
  bgPaletteContainer: {
    //backgroundColor: 'red',
    marginVertical: 5,
  },
  textPaletteContainer: {
    //backgroundColor: 'grey',
    marginVertical: 5,
  },
  previewContainer: {
    //backgroundColor: 'blue',
    marginVertical: 5,
  },

  previewBox: {
    height: 80,
    marginVertical: 5,
    paddingTop: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SettingTabScreen;
