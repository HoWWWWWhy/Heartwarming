import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Share,
  Alert,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
//import {RNKakaoLink} from '../utils/NativeModules';
import KakaoShareLink from 'react-native-kakao-share-link';
//import CameraRoll from '@react-native-community/cameraroll';
//import ViewShot from 'react-native-view-shot';

import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import Card from '../components/Card';
import FloatingActionButton from '../components/FloatingActionButton';
import FloatingShareButton from '../components/FloatingShareButton';
import constants from '../constants';
import _ from 'lodash';

const CategoryScreen = ({route, navigation}) => {
  const {categories, setCategories} = useContext(Store);

  const {itemId, screenName} = route.params;

  const BUTTON_INACTIVE_COLOR = 'darkgrey';

  const [categoryIdx, setCategoryIdx] = useState(-1);

  const [contents, setContents] = useState('');
  const [prepos, setPrepos] = useState('No Contents');
  const [source, setSource] = useState('');

  const [prevButtonDisable, setPrevButtonDisable] = useState(false);
  const [prevButtonColor, setPrevButtonColor] = useState(BUTTON_INACTIVE_COLOR);
  const [nextButtonDisable, setNextButtonDisable] = useState(false);
  const [nextButtonColor, setNextButtonColor] = useState(BUTTON_INACTIVE_COLOR);

  const [copiedText, setCopiedText] = useState('');

  //const imageRef = useRef(null);
  //const hideShot = true;

  useEffect(() => {
    //console.log('useEffect', screenName, itemId, navigation);
    //console.log('useEffect:', screenName, categories);

    if (categoryIdx <= -1) {
      const newIdx = categories.findIndex(
        category => Object.keys(category)[0] === screenName,
      );
      setCategoryIdx(newIdx);
    } else {
      if (
        itemId > 0 &&
        itemId === categories[categoryIdx][screenName]['data'].length
      ) {
        navigation.setParams({
          itemId: itemId - 1,
          screenName,
        });
      } else {
        if (categories[categoryIdx][screenName]['data'].length > 0) {
          setContents(
            categories[categoryIdx][screenName]['data'][itemId]['contents'],
          );
          setPrepos(
            categories[categoryIdx][screenName]['data'][itemId]['prepos'],
          );
          setSource(
            categories[categoryIdx][screenName]['data'][itemId]['source'],
          );
          if (itemId === 0) {
            setPrevButtonDisable(true);
            setPrevButtonColor(BUTTON_INACTIVE_COLOR);
          } else {
            setPrevButtonDisable(false);
            setPrevButtonColor(
              categories[categoryIdx][screenName]['setting']['textColor'],
            );
          }
          if (
            itemId ===
            categories[categoryIdx][screenName]['data'].length - 1
          ) {
            setNextButtonDisable(true);
            setNextButtonColor(BUTTON_INACTIVE_COLOR);
          } else {
            setNextButtonDisable(false);
            setNextButtonColor(
              categories[categoryIdx][screenName]['setting']['textColor'],
            );
          }
        } else {
          setContents('');
          setPrepos('No Contents');
          setSource('');
          setPrevButtonDisable(true);
          setPrevButtonColor(BUTTON_INACTIVE_COLOR);
          setNextButtonDisable(true);
          setNextButtonColor(BUTTON_INACTIVE_COLOR);
        }
      }
    }
  }, [categoryIdx, itemId, categories]);

  const setPrevItemId = () => {
    let prevId = itemId - 1;
    if (prevId < 0) {
      prevId = 0;
    }
    return prevId;
  };

  const setNextItemId = () => {
    let nextId = itemId + 1;
    if (categories[categoryIdx][screenName]['data'].length === 0) {
      nextId = 0;
    } else if (
      nextId >
      categories[categoryIdx][screenName]['data'].length - 1
    ) {
      nextId = categories[categoryIdx][screenName]['data'].length - 1;
    }
    return nextId;
  };

  const storeData = async data => {
    let newData = _.cloneDeep(categories);
    newData[categoryIdx][screenName]['data'] = data;

    try {
      await AsyncStorage.setItem('@Data', JSON.stringify(newData));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const copyToClipboard = () => {
    prepos.length > 0
      ? Clipboard.setString(
          `${contents}
  
${prepos} ${source}`,
        )
      : Clipboard.setString(
          `${contents}
  
${source}`,
        );
    fetchCopiedText();
    //console.log('copyToClipboard');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const onShareByText = async () => {
    //console.log('onShareByText');
    try {
      const result = await Share.share({
        title: 'Heartwarming에서 전하는 메시지',
        message: `
        
${contents}
    
${prepos} ${source}`,
      });
      if (result.action === Share.sharedAction) {
        //console.log(result.action);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onShareByGift = async () => {
    console.log('onShareByGift');
    // console.log('contents length:', contents.length);
    // console.log('contents:', contents);
    // console.log('prepos length:', prepos.length);
    // console.log('source length:', source.length);

    //RNKakaoLink.printTestLog('onShareByGift from ReactNative');
    /*
    try {
      const result = await Share.share({
        title: 'Heartwarming에서 전하는 메시지',
        message: `heartwarming://home/link/add/${
          contents.length > 0 ? contents : '-'
        }/${prepos.length > 0 ? prepos : 'blank'}/${
          source.length > 0 ? source : '-'
        }`,
        //home/:from/:to/:contents/:prepos/:source
      });
      if (result.action === Share.sharedAction) {
        //console.log(result.action);
      }
    } catch (error) {
      alert(error.message);
    }
    */

    try {
      // url encoding
      const contentsValue =
        contents.length > 0 ? encodeURIComponent(contents) : '-';

      const preposValue =
        prepos.length > 0 ? encodeURIComponent(prepos) : 'blank';

      const sourceValue = source.length > 0 ? encodeURIComponent(source) : '-';

      //contents.length > 0 ? (contents.replace(/(\n|\r\n)/g, '%0a').replace('$', "") : '-';

      const response = await KakaoShareLink.sendFeed({
        content: {
          title: 'Heartwarming에서 선물이\n도착했습니다♡',
          imageUrl:
            'https://play-lh.googleusercontent.com/jK5vscIO0bz9gC9N-byOvAWIHvmJac91KuGC89rYGPaUcdGK__2i-_w7jpyEACmrQc6m=s360-rw',
          link: {
            webUrl:
              'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming',
            mobileWebUrl:
              'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming',
          },
          //description: 'Heartwarming에서 선물이 도착했습니다♡',
        },
        buttons: [
          {
            title: '선물 받기',
            link: {
              androidExecutionParams: [
                {key: 'from', value: 'link'},
                {key: 'to', value: 'add'},
                {
                  key: 'contents',
                  value: contentsValue,
                },
                {
                  key: 'prepos',
                  value: preposValue,
                },
                {
                  key: 'source',
                  value: sourceValue,
                },
              ],
            },
          },
        ],
      });
      //console.log(response);
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  const onShareByImage = async () => {
    //console.log('onShareByImage');
    Alert.alert('준비 중인 기능입니다 :)');
    /*          <ViewShot
    ref={imageRef}
    options={{format: 'png', quality: 1.0}}></ViewShot>*/
    /*
    try {
      const imageUri = await imageRef.current.capture();
      console.log(imageUri);

      const hasPermission = await hasAndroidPermission();
      if (Platform.OS === 'android' && hasPermission) {
        const result = await CameraRoll.save(imageUri);
        console.log(result);
      }
    } catch (error) {
      alert(error.message);
    }
    */
  };
  /*
  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
*/
  const onCreate = () => {
    navigation.navigate('Add', {itemId: itemId, screenName: screenName});
  };

  const onUpdate = () => {
    navigation.navigate('Update', {itemId: itemId, screenName: screenName});
  };

  const onDelete = () => {
    let cur_data = _.cloneDeep(categories[categoryIdx][screenName]['data']);
    let newData = _.cloneDeep(categories);

    if (cur_data.length > 0) {
      cur_data.splice(itemId, 1);
      //console.log(JSON.stringify(cur_data), screenName);

      storeData(cur_data);

      newData[categoryIdx][screenName]['data'] = cur_data;
      setCategories(newData);

      if (cur_data.length === itemId && cur_data.length > 0) {
        //맨 끝 아이템을 삭제한 경우
        //console.log('delete last item');
        navigation.navigate('CategoryScreen', {itemId: itemId - 1, screenName});
      } else {
        //console.log('delete item');
        navigation.navigate('CategoryScreen', {itemId: itemId, screenName});
      }
    }
  };

  const renderInnerContainer = () => {
    return (
      <>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            disabled={prevButtonDisable}
            onPress={() =>
              navigation.navigate('CategoryScreen', {
                itemId: setPrevItemId(),
                screenName,
              })
            }>
            <Icon name="chevron-left" size={40} color={prevButtonColor} />
          </TouchableOpacity>

          <Card
            contents={contents}
            prepos={prepos}
            source={source}
            textColor={
              categories[categoryIdx][screenName]['setting']['textColor']
            }
          />

          <TouchableOpacity
            disabled={nextButtonDisable}
            onPress={() =>
              navigation.navigate('CategoryScreen', {
                itemId: setNextItemId(),
                screenName,
              })
            }>
            <Icon name="chevron-right" size={40} color={nextButtonColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.leftButtonContainer}>
            <TouchableOpacity onPress={copyToClipboard}>
              <View style={[styles.leftButtons, styles.copyButton]}>
                <Icon name="content-copy" size={30} color={'white'} />
              </View>
            </TouchableOpacity>
            <FloatingShareButton
              disabled={
                categoryIdx > -1 &&
                categories[categoryIdx][screenName]['data'].length > 0
                  ? false
                  : true
              }
              onShareByGift={onShareByGift}
              onShareByText={onShareByText}
              onShareByImage={onShareByImage}
            />
            {/*
            <TouchableOpacity onPress={onShare}>
              <View style={[styles.leftButtons, styles.shareButton]}>
                <Icon name="share" size={30} color={'white'} />
              </View>
            </TouchableOpacity>
            */}
          </View>
          <View style={styles.rightButtonContainer}>
            <FloatingActionButton
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
              updateDisabled={
                categoryIdx > -1 &&
                categories[categoryIdx][screenName]['data'].length > 0
                  ? false
                  : true
              }
              deleteDisabled={
                categoryIdx > -1 &&
                categories[categoryIdx][screenName]['data'].length > 0
                  ? false
                  : true
              }
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {categoryIdx > -1 &&
        (categories[categoryIdx][screenName]['setting'].useBgImage ? (
          <ImageBackground
            source={categories[categoryIdx][screenName]['setting'].bgImage}
            blurRadius={
              categories[categoryIdx][screenName]['setting'].bgImageBlur
            }
            style={styles.image}>
            {renderInnerContainer()}
          </ImageBackground>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor:
                categories[categoryIdx][screenName]['setting'].bgColor,
            }}>
            {renderInnerContainer()}
          </View>
        ))}
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
  buttonContainer: {
    flex: 1,
    //bottom: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: 'yellow',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Math.round(constants.width / 2.0) - 20,
    //backgroundColor: 'green',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Math.round(constants.width / 2.0) - 20,
    //backgroundColor: 'blue',
  },
  leftButtons: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  copyButton: {
    backgroundColor: '#7f8fa6',
  },
  /*
  shareButton: {
    backgroundColor: '#40739e',
  },
  */
});

export default CategoryScreen;
