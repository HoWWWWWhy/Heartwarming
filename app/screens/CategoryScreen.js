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

  useEffect(() => {
    //console.log('useEffect', screenName, itemId, navigation);
    //console.log('useEffect:', screenName, categories);

    if (categoryIdx <= -1) {
      const newIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === screenName,
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

  const storeData = async (data) => {
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
      {categoryIdx > -1 ? (
        categories[categoryIdx][screenName]['setting'].useBgImage ? (
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
        )
      ) : null}
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
