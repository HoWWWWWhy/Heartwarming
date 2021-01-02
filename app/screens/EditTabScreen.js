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
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import appStyles from '../styles';
import Palette from '../components/Palette';
import constants from '../constants';
import assets from '../default_assets';
import _ from 'lodash';

const TAB_NAVIGATION_BAR_HEIGHT = 60;

const EditTabScreen = ({route}) => {
  const {categories, setCategories} = useContext(Store);

  const {screenName} = route.params;

  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [tempImage, setTempImage] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState('');
  const [selectedTextColor, setSelectedTextColor] = useState('');

  const animation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // console.log(RNFS.DocumentDirectoryPath);
    // console.log(RNFS.CachesDirectoryPath);
    // console.log(RNFS.TemporaryDirectoryPath);
    // console.log(RNFS.ExternalDirectoryPath);

    if (categoryIdx <= -1) {
      const newIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === screenName,
      );

      setCategoryIdx(newIdx);
    } else {
      if (categories[categoryIdx][screenName]['setting'].useBgImage) {
        pickImageButtonFadeIn();
      } else {
        pickImageButtonFadeOut();
      }

      setSelectedBgColor(
        categories[categoryIdx][screenName]['setting'].bgColor,
      );
      setSelectedTextColor(
        categories[categoryIdx][screenName]['setting'].textColor,
      );
    }
    // return () => {
    //   //console.log("EditTabScreen Cleanup");
    //   storeData(categories);
    // };
    //}, [categoryIdx, categories, selectedBgColor, selectedTextColor]);
  }, [categoryIdx, selectedBgColor, selectedTextColor]);

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
    let newData = _.cloneDeep(categories);
    newData[categoryIdx][screen_name]['setting'].useBgImage = !categories[
      categoryIdx
    ][screen_name]['setting'].useBgImage;
    if (newData[categoryIdx][screen_name]['setting'].useBgImage) {
      pickImageButtonFadeIn();
    } else {
      pickImageButtonFadeOut();
    }
    setCategories(newData);
    storeData(newData);
  };

  const changeBgColor = (color) => {
    let newData = _.cloneDeep(categories);
    newData[categoryIdx][screenName]['setting'].bgColor = color;

    setSelectedBgColor(color);
    setCategories(newData);
    storeData(newData);
  };

  const changeTextColor = (color) => {
    let newData = _.cloneDeep(categories);
    newData[categoryIdx][screenName]['setting'].textColor = color;

    setSelectedTextColor(color);
    setCategories(newData);
    storeData(newData);
  };

  const onPickImage = async (screen_name) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 2 * constants.width,
        height:
          2 *
          (constants.height -
            StatusBar.currentHeight -
            TAB_NAVIGATION_BAR_HEIGHT),
        cropping: true,
        // includeExif: true,
        // includeBase64: true,
      });

      if (tempImage !== '') {
        const deletedTempImage = await RNFS.unlink(
          RNFS.ExternalDirectoryPath + '/Pictures/' + tempImage,
        );
      }

      setTempImage(image.path.split('/').pop());

      let newData = _.cloneDeep(categories);
      newData[categoryIdx][screen_name]['setting'].bgImage = {uri: image.path};
      newData[categoryIdx][screen_name]['setting'].bgImageBlur = 0;

      setCategories(newData);
      storeData(newData);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const onTakePhoto = async (screen_name) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 2 * constants.width,
        height:
          2 *
          (constants.height -
            StatusBar.currentHeight -
            TAB_NAVIGATION_BAR_HEIGHT),
        cropping: true,
      });

      if (tempImage !== '') {
        const deletedTempImage = await RNFS.unlink(
          RNFS.ExternalDirectoryPath + '/Pictures/' + tempImage,
        );
      }

      setTempImage(image.path.split('/').pop());

      let newData = _.cloneDeep(categories);
      newData[categoryIdx][screen_name]['setting'].bgImage = {uri: image.path};
      newData[categoryIdx][screen_name]['setting'].bgImageBlur = 0;

      setCategories(newData);
      storeData(newData);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const onChangeBlur = (screen_name) => {
    let newData = _.cloneDeep(categories);
    const oldBlurRadius =
      newData[categoryIdx][screen_name]['setting'].bgImageBlur;
    const newBlurRadius = oldBlurRadius === 2 ? 0 : oldBlurRadius + 0.5;
    newData[categoryIdx][screen_name]['setting'].bgImageBlur = newBlurRadius;

    setCategories(newData);
    storeData(newData);
  };

  const onInitializeImage = (screen_name) => {
    let newData = _.cloneDeep(categories);

    const bgImageNum = assets.defaultNewBgImage.findIndex(
      (image) => image === newData[categoryIdx][screen_name]['setting'].bgImage,
    );
    newData[categoryIdx][screen_name]['setting'].bgImage =
      assets.defaultNewBgImage[
        (bgImageNum + 1) % assets.defaultNewBgImage.length
      ];
    newData[categoryIdx][screen_name]['setting'].bgImageBlur = 0;

    setCategories(newData);
    storeData(newData);
  };

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('@Data', JSON.stringify(data));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const renderPickImageButton = (screen_name) => {
    return (
      <>
        <TouchableOpacity onPress={() => onPickImage(screen_name)}>
          <Animated.View style={[{opacity: animation}]}>
            <View style={styles.imageControlButton}>
              <Icon name="image" size={30} color={'#487eb0'} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </>
    );
  };

  const renderCameraButton = (screen_name) => {
    return (
      <>
        <TouchableOpacity onPress={() => onTakePhoto(screen_name)}>
          <Animated.View style={[{opacity: animation}]}>
            <View style={styles.imageControlButton}>
              <Icon name="camera-retro" size={30} color={'#686de0'} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </>
    );
  };

  const renderBlurEffectButton = (screen_name) => {
    return (
      <>
        <TouchableOpacity onPress={() => onChangeBlur(screen_name)}>
          <Animated.View style={[{opacity: animation}]}>
            <View style={styles.imageControlButton}>
              <MaterialIcons name="blur-on" size={30} color={'#487eb0'} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </>
    );
  };

  const renderInitializeImageButton = (screen_name) => {
    return (
      <>
        <TouchableOpacity onPress={() => onInitializeImage(screen_name)}>
          <Animated.View style={[{opacity: animation}]}>
            <View style={styles.imageControlButton}>
              <MaterialIcons
                name="settings-backup-restore"
                size={30}
                color={'#686de0'}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {categoryIdx > -1 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.switchContainer}>
            <Text style={styles.text}>배경이미지 사용하기</Text>
            <Switch
              trackColor={{false: '#767577', true: '#6ab04c'}}
              thumbColor={
                categories[categoryIdx][screenName]['setting'].useBgImage
                  ? '#fab1a0'
                  : 'black'
              }
              onValueChange={() => toggleSwitch(screenName)}
              value={categories[categoryIdx][screenName]['setting'].useBgImage}
              style={styles.toggleSwitch}
            />
          </View>
          <View style={styles.paletteContainer}>
            <View style={styles.bgPaletteContainer}>
              <Text style={styles.text}>배경색 선택</Text>
              <Palette setting={changeBgColor} selected={selectedBgColor} />
            </View>
            <View style={styles.textPaletteContainer}>
              <Text style={styles.text}>글씨색 선택</Text>
              <Palette setting={changeTextColor} selected={selectedTextColor} />
            </View>
          </View>
          <View style={styles.previewContainer}>
            <Text style={styles.text}>미리보기</Text>
            <View style={styles.previewImageContainer}>
              {categories[categoryIdx][screenName]['setting'].useBgImage ? (
                <ImageBackground
                  source={
                    categories[categoryIdx][screenName]['setting'].bgImage
                  }
                  blurRadius={
                    categories[categoryIdx][screenName]['setting'].bgImageBlur
                  }
                  style={[
                    styles.previewBox,
                    styles.previewBgImage,
                    styles.previewHeight,
                  ]}>
                  <Text
                    style={[
                      styles.previewText,
                      {
                        color:
                          categories[categoryIdx][screenName]['setting']
                            .textColor,
                      },
                    ]}>
                    인생은 속도가 아니라 방향이다.
                  </Text>
                  <Text
                    style={[
                      styles.previewText,
                      {
                        color:
                          categories[categoryIdx][screenName]['setting']
                            .textColor,
                      },
                    ]}>
                    by 괴테
                  </Text>
                </ImageBackground>
              ) : (
                <View
                  style={[
                    styles.previewBox,
                    styles.previewHeight,
                    {
                      backgroundColor:
                        categories[categoryIdx][screenName]['setting'].bgColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.previewText,
                      {
                        color:
                          categories[categoryIdx][screenName]['setting']
                            .textColor,
                      },
                    ]}>
                    인생은 속도가 아니라 방향이다.
                  </Text>
                  <Text
                    style={[
                      styles.previewText,
                      {
                        color:
                          categories[categoryIdx][screenName]['setting']
                            .textColor,
                      },
                    ]}>
                    by 괴테
                  </Text>
                </View>
              )}
              <View
                style={[styles.previewImageController, styles.previewHeight]}>
                {renderPickImageButton(screenName)}
                {renderCameraButton(screenName)}
                {renderBlurEffectButton(screenName)}
                {renderInitializeImageButton(screenName)}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: appStyles.backgroundColor,
  },
  text: {
    fontSize: 16,
    textAlignVertical: 'center',
    //backgroundColor: 'yellow',
    paddingLeft: 5,
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    //backgroundColor: 'red',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toggleSwitch: {
    marginHorizontal: 5,
    transform: [{scaleX: 1.0}, {scaleY: 1.0}],
    //backgroundColor: 'yellow',
  },
  paletteContainer: {
    flex: 9,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  previewImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: 'green',
  },
  previewBox: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  previewImageController: {
    //backgroundColor: 'white',
    width: constants.width - 20 * 2 - 5 * 2 - 200 - 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  previewHeight: {
    height: Math.round(
      (200 *
        (constants.height -
          StatusBar.currentHeight -
          TAB_NAVIGATION_BAR_HEIGHT)) /
        constants.width,
    ),
    marginVertical: 5,
  },
  previewText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageControlButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 3,
  },
  previewBgImage: {
    resizeMode: 'cover',
  },
});

export default EditTabScreen;
