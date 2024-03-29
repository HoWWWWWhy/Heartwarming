import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import appStyles from '../styles';
import OcrCamera, {RNCameraConstants} from '../components/OcrCamera';
import _ from 'lodash';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Add = ({navigation, route}) => {
  const {categories, setCategories, appTheme, onChangeAppTheme} = useContext(
    Store,
  );

  const defaultContents =
    '하지만 우린 나아가야 한다.\n의심을 인생철학으로 선택하는 것은,\n운송수단으로 "정지"를 선택하는 것과 비슷하다.';
  //'If someone is nice to you but rude to the waiter, \nthey are not a nice person.';
  const defaultSource = '얀 마텔 <파이 이야기>';
  //'The Waiter Rule';
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in', '-', ''];
  const [preposIndex, setPreposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');

  const categoryList = categories.map(
    cur_category => Object.keys(cur_category)[0],
  );

  const [category, setCategory] = useState(categoryList[0]);

  const [insertFlag, setInsertFlag] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [screenName, setScreenName] = useState('');

  const [cameraOn, setCameraOn] = useState(false);
  const [recognizedWordList, setRecognizedWordList] = useState([]);

  useEffect(() => {
    //console.log('App Theme', appTheme);
    //console.log('Add Mounted');
    //console.log(route.params);
    //console.log('categoryList', categoryList);
    //console.log('categories', categories);

    onChangeAppTheme();
    if (typeof route.params !== 'undefined') {
      if (route.params.from === 'link') {
        //console.log('App is opened by app-link!');
        setContents(route.params.contents);
        const idx = preposList.findIndex(x => x === route.params.prepos);
        if (route.params.prepos === 'blank' || idx === -1) {
          //console.log('Add route.params.prepos: blank');
          setPreposIndex(0);
          setPrepos(preposList[preposList.length - 1]);
        } else {
          setPreposIndex(idx + 1);
          setPrepos(route.params.prepos);
        }
        setSource(route.params.source);
      } else {
        setInsertFlag(true);
        setItemId(route.params.itemId);
        setScreenName(route.params.screenName);
        setCategory(route.params.screenName);
      }
    }
  }, []);

  const storeData = async () => {
    const new_data = {
      contents,
      prepos,
      source,
    };

    //console.log('data:', new_data);

    try {
      //console.log(categories);
      let cur_data = [];
      let newData = _.cloneDeep(categories);
      const newIdx = categories.findIndex(
        cur_category => Object.keys(cur_category)[0] === category,
      );
      cur_data = newData[newIdx][category]['data'];

      if (insertFlag) {
        cur_data.splice(itemId, 0, new_data);
      } else {
        cur_data.push(new_data);
      }
      newData[newIdx][category]['data'] = cur_data;
      await AsyncStorage.setItem('@Data', JSON.stringify(newData));
      setCategories(newData);

      navigation.goBack();

      if (typeof route.params !== 'undefined') {
        if (route.params.from === 'link') {
          console.log('This is Store from deeplink');
          navigation.navigate('Home');
        }
      }
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const changeList = () => {
    setPreposIndex(prevIndex => prevIndex + 1);
    if (preposIndex % preposList.length > preposList.length - 2) {
      setPreposIndex(0);
    }

    setPrepos(preposList[preposIndex]);
  };

  const onOCRCapture = recogonized_text => {
    if (
      recogonized_text &&
      recogonized_text.textBlocks &&
      recogonized_text.textBlocks.length > 0
    ) {
      //console.log('onCapture', recogonized_text.textBlocks);
      getElementTextBlocks(recogonized_text, 'BLOCK'); //"BLOCK", "LINE", "ELEMENT"
    }
    setCameraOn(false);
  };

  const getElementTextBlocks = (data, division_type) => {
    let wordList = [];
    let contents = '';
    const blockType_num = data.textBlocks.length;
    //console.log('-------------------------------------');
    for (let i = 0; i < blockType_num; i++) {
      let curTextBlock = data.textBlocks[i];
      if (curTextBlock.type === 'block') {
        if (division_type === 'BLOCK') {
          wordList.push(curTextBlock.value);
        } else {
          let lineType_num = curTextBlock.components.length;
          for (let j = 0; j < lineType_num; j++) {
            let curLineBlock = curTextBlock.components[j];
            if (curLineBlock.type === 'line') {
              if (division_type === 'LINE') {
                wordList.push(curLineBlock.value);
              } else {
                let elementType_num = curLineBlock.components.length;
                for (let k = 0; k < elementType_num; k++) {
                  let curElementBlock = curLineBlock.components[k];
                  if (curElementBlock.type === 'element') {
                    if (division_type === 'ELEMENT') {
                      wordList.push(curElementBlock.value);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    setRecognizedWordList(wordList);

    wordList.map(
      (word, idx) =>
        (contents += idx === wordList.length - 1 ? word : word + '\n'),
    );
    //console.log(contents);
    setContents(contents);
    //console.log(wordList);
  };
  return (
    <DismissKeyboard>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.contentsContainer}>
            <Text style={styles.textTitle}>기억하고 싶은 구절</Text>
            <TouchableOpacity
              onPress={() => setCameraOn(true)}
              style={styles.cameraButton}>
              <Icon name="photo-camera" size={20} color={'#34495e'} />
            </TouchableOpacity>
            <Text style={{fontSize: 10}}>(베타 버전, Only English)</Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              styles.textInputContents,
              {
                backgroundColor:
                  appTheme === 'dark'
                    ? appStyles.themes.dark.textInputBackgroundColor
                    : appStyles.themes.light.textInputBackgroundColor,
              },
            ]}
            placeholder={defaultContents}
            defaultValue={contents}
            multiline
            editable
            returnKeyLabel="done"
            onChangeText={text => setContents(text)}
          />
          <View style={styles.preposContainer}>
            <TouchableOpacity onPress={changeList}>
              <Text style={[styles.textTitle, styles.textPrepos]}>
                {prepos}
              </Text>
            </TouchableOpacity>
            <Text style={styles.textComment}>
              {`<- 누르면 바뀌어요! ( ${preposList.join(', ')}공백 )`}
            </Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              styles.textInputSource,
              {
                backgroundColor:
                  appTheme === 'dark'
                    ? appStyles.themes.dark.textInputBackgroundColor
                    : appStyles.themes.light.textInputBackgroundColor,
              },
            ]}
            placeholder={defaultSource}
            defaultValue={source}
            multiline
            editable
            onChangeText={text => setSource(text)}
          />
          <Text style={styles.textTitle}>카테고리</Text>
          <View style={styles.pickerView}>
            <Picker
              selectedValue={category}
              enabled={insertFlag ? false : true}
              style={[
                styles.picker,
                {
                  backgroundColor:
                    appTheme === 'dark'
                      ? appStyles.themes.dark.pickerBackgroundColor
                      : appStyles.themes.light.pickerBackgroundColor,
                  color:
                    appTheme === 'dark'
                      ? appStyles.themes.dark.pickerTextColor
                      : appStyles.themes.light.pickerTextColor,
                },
              ]}
              mode={'dialog'}
              //prompt={'카테고리'}
              dropdownIconColor={
                insertFlag
                  ? '#a4b0be'
                  : appTheme === 'dark'
                  ? appStyles.themes.dark.pickerTextColor
                  : appStyles.themes.light.pickerTextColor
              }
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
              {categoryList.map(item => (
                <Picker.Item
                  key={item}
                  label={item}
                  value={item}
                  style={{
                    color:
                      appTheme === 'dark'
                        ? appStyles.themes.dark.pickerTextColor
                        : appStyles.themes.light.pickerTextColor,
                  }}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={storeData}>
            <Text style={styles.textButton}>추가하기</Text>
          </TouchableOpacity>
          {cameraOn && (
            <OcrCamera
              cameraType={RNCameraConstants.Type.back}
              flashMode={RNCameraConstants.FlashMode.off}
              autoFocus={RNCameraConstants.AutoFocus.on}
              whiteBalance={RNCameraConstants.WhiteBalance.auto}
              ratio={'4:3'}
              quality={0.8}
              imageWidth={800}
              enabledOCR={true}
              onCapture={(data, recogonizedText) =>
                onOCRCapture(recogonizedText)
              }
              onClose={() => setCameraOn(false)}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 0,
    height: constants.height,
    width: constants.width,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: appStyles.backgroundColor,
  },
  contentsContainer: {
    flexDirection: 'row',
  },
  cameraButton: {
    width: 20,
    height: 20,
    //backgroundColor: 'white',
    marginHorizontal: 5,
  },

  preposContainer: {
    flexDirection: 'row',
  },
  textTitle: {
    fontSize: 14,
    color: 'black',
  },
  textPrepos: {
    width: 50,
  },
  textComment: {
    fontSize: 14,
    color: 'gray',
  },

  textInput: {
    //borderBottomColor: 'black',
    //borderBottomWidth: 1,
    marginVertical: 10,
    //backgroundColor: '#f1f2f6',
    fontSize: 15,
    textAlignVertical: 'center',
  },
  textInputContents: {
    height: constants.height * 0.3,
  },
  textInputSource: {
    height: 50,
  },
  picker: {
    height: 50,
    //backgroundColor: 'yellow',
    //color: 'black',
  },
  pickerView: {
    height: 50,
    marginTop: 10,
    backgroundColor: '#f1f2f6',
  },
  addButton: {
    backgroundColor: appStyles.commonButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
    //height: 40,
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

export default Add;
