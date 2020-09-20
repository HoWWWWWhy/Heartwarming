import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ImageBackground,
  Animated,
  StatusBar,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  const animation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    switch (screenName) {
      case 'Movie':
        if (Object.keys(thisMovieSetting).length === 0) {
          setThisMovieSetting(movieSetting);
          if (movieSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        } else {
          if (thisMovieSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        }
        break;

      case 'Lyrics':
        if (Object.keys(thisLyricsSetting).length === 0) {
          setThisLyricsSetting(lyricsSetting);
          if (lyricsSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        } else {
          if (thisLyricsSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        }
        break;

      case 'Book':
        if (Object.keys(thisBookSetting).length === 0) {
          setThisBookSetting(bookSetting);
          if (bookSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        } else {
          if (thisBookSetting.useBgImage) {
            pickImageButtonFadeIn();
          }
        }
        break;

      default:
    }
  }, []);

  const pickImageButtonFadeIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    //console.log('fadeIn');
  };
  const pickImageButtonFadeOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    //console.log('fadeOut');
  };

  const toggleSwitch = (screen_name) => {
    switch (screen_name) {
      case 'Movie':
        setThisMovieSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        if (!thisMovieSetting.useBgImage) {
          pickImageButtonFadeIn();
        } else {
          pickImageButtonFadeOut();
        }
        break;

      case 'Lyrics':
        setThisLyricsSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        if (!thisLyricsSetting.useBgImage) {
          pickImageButtonFadeIn();
        } else {
          pickImageButtonFadeOut();
        }
        break;

      case 'Book':
        setThisBookSetting((prevState) => ({
          ...prevState,
          useBgImage: !prevState.useBgImage,
        }));
        if (!thisBookSetting.useBgImage) {
          pickImageButtonFadeIn();
        } else {
          pickImageButtonFadeOut();
        }
        break;

      default:
    }
  };

  const onPickImage = async (screen_name) => {
    try {
      const image = await ImagePicker.openPicker({
        width: constants.width,
        height: constants.height - StatusBar.currentHeight - 60,
        cropping: true,
      });
      switch (screen_name) {
        case 'Movie':
          setThisMovieSetting((prevState) => ({
            ...prevState,
            bgImage: {uri: image.path},
          }));
          break;
        case 'Lyrics':
          setThisLyricsSetting((prevState) => ({
            ...prevState,
            bgImage: {uri: image.path},
          }));
          break;

        case 'Book':
          setThisBookSetting((prevState) => ({
            ...prevState,
            bgImage: {uri: image.path},
          }));
          break;

        default:
      }
    } catch (e) {
      // saving error
      console.log(e);
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
              onValueChange={() => toggleSwitch(screen_name)}
              value={thisMovieSetting.useBgImage}
              style={styles.toggleSwitch}
            />
          </>
        );

      case 'Lyrics':
        return (
          <>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={thisLyricsSetting.useBgImage ? '#fab1a0' : 'black'}
              onValueChange={() => toggleSwitch(screen_name)}
              value={thisLyricsSetting.useBgImage}
              style={styles.toggleSwitch}
            />
          </>
        );

      case 'Book':
        return (
          <>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={thisBookSetting.useBgImage ? '#fab1a0' : 'black'}
              onValueChange={() => toggleSwitch(screen_name)}
              value={thisBookSetting.useBgImage}
              style={styles.toggleSwitch}
            />
          </>
        );

      default:
    }
  };

  const renderPickImageButton = (screen_name) => {
    return (
      <>
        <TouchableOpacity onPress={() => onPickImage(screen_name)}>
          <Animated.View style={[{opacity: animation}]}>
            <View style={styles.pickImageButton}>
              <Icon name="image" size={30} color={'#487eb0'} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </>
    );
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
        return thisMovieSetting.useBgImage ? (
          <ImageBackground
            source={thisMovieSetting.bgImage}
            style={[styles.previewBox, styles.previewBgImage]}>
            <Text
              style={[styles.previewText, {color: thisMovieSetting.textColor}]}>
              인생은 속도가 아니라 방향이다.
            </Text>
            <Text
              style={[styles.previewText, {color: thisMovieSetting.textColor}]}>
              by 괴테
            </Text>
          </ImageBackground>
        ) : (
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
        return thisLyricsSetting.useBgImage ? (
          <ImageBackground
            source={thisLyricsSetting.bgImage}
            style={[styles.previewBox, styles.previewBgImage]}>
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
          </ImageBackground>
        ) : (
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
        return thisBookSetting.useBgImage ? (
          <ImageBackground
            source={thisBookSetting.bgImage}
            style={[styles.previewBox, styles.previewBgImage]}>
            <Text
              style={[styles.previewText, {color: thisBookSetting.textColor}]}>
              인생은 속도가 아니라 방향이다.
            </Text>
            <Text
              style={[styles.previewText, {color: thisBookSetting.textColor}]}>
              by 괴테
            </Text>
          </ImageBackground>
        ) : (
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
        {renderPickImageButton(screenName)}
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
    paddingVertical: 5,
    backgroundColor: '#dfe6e9',
    //backgroundColor: 'yellow',
  },
  text: {
    fontSize: 16,
    textAlignVertical: 'center',
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    //backgroundColor: 'red',
    alignItems: 'center',
  },
  paletteContainer: {
    flex: 9,
    //backgroundColor: 'skyblue',
  },
  toggleSwitch: {
    marginHorizontal: 5,
    transform: [{scaleX: 1.0}, {scaleY: 1.0}],
    //backgroundColor: 'yellow',
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
    width: 200,
    height: Math.round(
      (200 * (constants.height - StatusBar.currentHeight - 60)) /
        constants.width,
    ),
    marginVertical: 5,
    //paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  previewText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickImageButton: {
    //width: 40,
    //height: 40,
    //backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    //borderRadius: 20,
    marginLeft: 14,
  },
  previewBgImage: {
    resizeMode: 'cover',
  },
});

export default SettingTabScreen;
