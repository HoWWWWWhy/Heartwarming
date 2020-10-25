import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ImageBackground, Share} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import Card from '../components/Card';
import FloatingActionButton from '../components/FloatingActionButton';
import constants from '../constants';
import _ from 'lodash';

const CategoryScreen = ({route, navigation}) => {
  const {categories, setCategories} = useContext(Store);

  //const {movies, setMovies} = useContext(Store);
  const {movieSetting, setMovieSetting} = useContext(Store);

  const {itemId, screenName} = route.params;

  const buttonColor = {active: movieSetting.textColor, inactive: 'darkgrey'};

  const [categoryIdx, setCategoryIdx] = useState(-1);
  //const [screenData, setScreenData] = useState(null);
  const [contents, setContents] = useState('');
  const [prepos, setPrepos] = useState('No Contents');
  const [source, setSource] = useState('');

  const [prevButtonDisable, setPrevButtonDisable] = useState(false);
  const [prevButtonColor, setPrevButtonColor] = useState(buttonColor.active);
  const [nextButtonDisable, setNextButtonDisable] = useState(false);
  const [nextButtonColor, setNextButtonColor] = useState(buttonColor.active);

  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    //console.log('useEffect', screenName, itemId);
    //console.log(Object.values(movies));
    //console.log('useEffect:', screenName, categories);

    if (categoryIdx <= -1) {
      const newIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === screenName,
      );

      setCategoryIdx(newIdx);
    } else {
      // console.log(
      //   itemId,
      //   categories,
      //   categoryIdx,
      //   categories[categoryIdx][screenName]['data'],
      //   categories[categoryIdx][screenName]['data'].length,
      // );
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
          setPrevButtonColor(buttonColor.inactive);
        } else {
          setPrevButtonDisable(false);
          setPrevButtonColor(buttonColor.active);
        }
        if (itemId === categories[categoryIdx][screenName]['data'].length - 1) {
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
    }
  }, [categoryIdx, itemId, categories]);
  //itemId, Object.values(movies)
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

  const storeData = async (data) => {
    try {
      console.log('storeData: ', data);
      //await AsyncStorage.setItem('@Movie', JSON.stringify(data));
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
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          prepos.length > 0
            ? `${contents}
    
${prepos} ${source}`
            : `${contents}

${source}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onCreate = () => {
    navigation.navigate('Add', {itemId: itemId, screenName: screenName});
  };

  const onUpdate = () => {
    navigation.navigate('Update', {itemId: itemId, screenName: screenName});
  };

  const onDelete = () => {
    let temp_data = _.cloneDeep(categories[categoryIdx][screenName]['data']);
    let newData = _.cloneDeep(categories);

    if (temp_data.length > 0) {
      temp_data.splice(itemId, 1);
      console.log(JSON.stringify(temp_data), screenName);

      storeData(temp_data);
      setCategories(newData);
      newData[categoryIdx][screenName]['data'] = temp_data;

      if (temp_data.length === itemId && temp_data.length > 0) {
        //맨 끝 아이템을 삭제한 경우
        console.log('delete last item');
        navigation.navigate('CategoryScreen', {itemId: itemId - 1, screenName});
      } else {
        console.log('navigate');
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
            textColor={movieSetting.textColor}
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
            <TouchableOpacity onPress={onShare}>
              <View style={[styles.leftButtons, styles.shareButton]}>
                <Icon name="share" size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>
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
      </>
    );
  };

  return (
    <View style={styles.container}>
      {movieSetting.useBgImage ? (
        <ImageBackground
          source={movieSetting.bgImage}
          blurRadius={movieSetting.bgImageBlur}
          style={styles.image}>
          {renderInnerContainer()}
        </ImageBackground>
      ) : (
        <View style={{flex: 1, backgroundColor: movieSetting.bgColor}}>
          {renderInnerContainer()}
        </View>
      )}
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
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: Math.round(constants.width / 2.0) - 20,
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
  shareButton: {
    backgroundColor: '#40739e',
  },
});

export default CategoryScreen;