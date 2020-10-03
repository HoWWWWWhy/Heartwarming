import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './Home';
import Store from '../store';
import OcrCamera, {RNCameraConstants} from '../components/OcrCamera';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Add = ({navigation, route}) => {
  const defaultContents =
    '하지만 우린 나아가야 한다.\n의심을 인생철학으로 선택하는 것은,\n운송수단으로 "정지"를 선택하는 것과 비슷하다.';
  //'If someone is nice to you but rude to the waiter, \nthey are not a nice person.';
  const defaultSource = '얀 마텔 <파이 이야기>';
  //'The Waiter Rule';
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in', '-', ''];
  const [preposIndex, setProposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');
  const categoryList = ['Movie', 'Lyrics', 'Book'];
  const [category, setCategory] = useState(categoryList[0]);

  const [insertFlag, setInsertFlag] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [screenName, setScreenName] = useState('');

  const [cameraOn, setCameraOn] = useState(false);
  const [recogonizedText, setrecogonizedText] = useState(null);

  const {movies, setMovies} = useContext(Store);
  const {lyrics, setLyrics} = useContext(Store);
  const {books, setBooks} = useContext(Store);

  useEffect(() => {
    if (typeof route.params !== 'undefined') {
      setInsertFlag(true);
      setItemId(route.params.itemId);
      setScreenName(route.params.screenName);
      setCategory(route.params.screenName);
    }
  }, [category]);

  const storeData = async () => {
    const new_data = {
      contents,
      prepos,
      source,
    };

    //console.log('data:', new_data);

    try {
      switch (category) {
        case 'Movie':
          if (insertFlag) {
            movies.splice(itemId, 0, new_data);
          } else {
            movies.push(new_data);
          }
          await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
          setMovies(movies);
          //console.log('movies:', movies);
          break;

        case 'Lyrics':
          if (insertFlag) {
            lyrics.splice(itemId, 0, new_data);
          } else {
            lyrics.push(new_data);
          }
          await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
          setLyrics(lyrics);
          //console.log('lyrics:', lyrics);
          break;

        case 'Book':
          if (insertFlag) {
            books.splice(itemId, 0, new_data);
          } else {
            books.push(new_data);
          }
          await AsyncStorage.setItem('@Book', JSON.stringify(books));
          setBooks(books);
          //console.log('books:', books);
          break;

        default:
      }

      navigation.navigate('Home');
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const changeList = () => {
    setProposIndex((prevIndex) => prevIndex + 1);
    if (preposIndex % preposList.length > preposList.length - 2) {
      setProposIndex(0);
    }

    setPrepos(preposList[preposIndex]);
  };

  const onOCRCapture = (recogonizedText) => {
    const textBlocks = recogonizedText.textBlocks;
    console.log('onCapture', textBlocks);
    //this.setState({showCamera: false, showWordList: Helper.isNotNullAndUndefined(recogonizedText), recogonizedText: recogonizedText});
  };
  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Text style={styles.textTitle}>기억하고 싶은 구절</Text>
        <TouchableOpacity onPress={() => setCameraOn(true)}>
          <Icon name="camera-retro" size={30} color={'#686de0'} />
          <Text>{cameraOn.toString()}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder={defaultContents}
          multiline
          editable
          returnKeyLabel="done"
          onChangeText={(text) => setContents(text)}
        />
        <View style={styles.preposContainer}>
          <TouchableOpacity onPress={changeList}>
            <Text style={[styles.textTitle, styles.textPrepos]}>{prepos}</Text>
          </TouchableOpacity>
          <Text style={styles.textComment}>
            {`<- 누르면 바뀌어요! ( ${preposList.join(', ')}공백 )`}
          </Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={defaultSource}
          multiline
          editable
          onChangeText={(text) => setSource(text)}
        />
        <Text style={styles.textTitle}>카테고리</Text>
        <Picker
          selectedValue={category}
          enabled={insertFlag ? false : true}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
          {categoryList.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
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
            quality={0.5}
            imageWidth={800}
            enabledOCR={true}
            onCapture={(data, recogonizedText) => onOCRCapture(recogonizedText)}
            onClose={() => setCameraOn(false)}
          />
        )}
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 0,
    height: constants.height,
    width: constants.width,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 50,
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  addButton: {
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

export default Add;
