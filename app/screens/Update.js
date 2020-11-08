import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {Picker} from '@react-native-community/picker';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import constants from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from './Home';
import Store from '../store';
import OcrCamera, {RNCameraConstants} from '../components/OcrCamera';
import _ from 'lodash';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Update = ({navigation, route}) => {
  const [contents, setContents] = useState('');
  const preposList = ['By', 'From', 'in', '-', ''];
  const [preposIndex, setProposIndex] = useState(1);
  const [prepos, setPrepos] = useState(preposList[0]);
  const [source, setSource] = useState('');
  const categoryList = ['Movie', 'Lyrics', 'Book'];
  const [category, setCategory] = useState(categoryList[0]);

  const [cameraOn, setCameraOn] = useState(false);
  const [recognizedWordList, setRecognizedWordList] = useState([]);

  // const {movies, setMovies} = useContext(Store);
  // const {lyrics, setLyrics} = useContext(Store);
  // const {books, setBooks} = useContext(Store);

  const {itemId, screenName} = route.params;
  const {categories, setCategories} = useContext(Store);

  useEffect(() => {
    const newIdx = categories.findIndex(
      (category) => Object.keys(category)[0] === screenName,
    );
    //console.log(categories[newIdx][screenName]['data'][itemId]);
    setContents(categories[newIdx][screenName]['data'][itemId]['contents']);
    setPrepos(categories[newIdx][screenName]['data'][itemId]['prepos']);
    setSource(categories[newIdx][screenName]['data'][itemId]['source']);
    setCategory(screenName);
    if (
      preposList.indexOf(
        categories[newIdx][screenName]['data'][itemId]['prepos'],
      ) %
        preposList.length >
      preposList.length - 2
    ) {
      setProposIndex(0);
    } else {
      setProposIndex(
        preposList.indexOf(
          categories[newIdx][screenName]['data'][itemId]['prepos'],
        ) + 1,
      );
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
      let deleted_data = [];
      let added_data = [];
      let newData = _.cloneDeep(categories);
      const oldIdx = categories.findIndex(
        (cur_category) => Object.keys(cur_category)[0] === screenName,
      );
      const newIdx = categories.findIndex(
        (cur_category) => Object.keys(cur_category)[0] === category,
      );
      deleted_data = newData[oldIdx][screenName]['data'];
      added_data = newData[newIdx][category]['data'];

      if (screenName === category) {
        deleted_data.splice(itemId, 1, new_data);
        newData[newIdx][category]['data'] = deleted_data;
        await AsyncStorage.setItem('@Data', JSON.stringify(newData));
        setCategories(newData);
      } else {
        deleted_data.splice(itemId, 1); //delete from previous list
        newData[oldIdx][screenName]['data'] = deleted_data;
        added_data.push(new_data); //add to current list
        newData[newIdx][category]['data'] = added_data;
        await AsyncStorage.setItem('@Data', JSON.stringify(newData));
        setCategories(newData);
      }

      navigation.goBack();
    } catch (e) {
      // saving error
      console.log(e);
    }

    // try {
    //   switch (category) {
    //     case 'Movie':
    //       if (screenName === category) {
    //         movies.splice(itemId, 1, new_data);

    //         await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
    //         setMovies(movies);
    //         //console.log('movies:', movies);
    //       } else {
    //         switch (screenName) {
    //           case 'Lyrics':
    //             lyrics.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
    //             setLyrics(lyrics);

    //             movies.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
    //             setMovies(movies);
    //             break;
    //           case 'Book':
    //             books.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Book', JSON.stringify(books));
    //             setBooks(books);

    //             movies.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
    //             setMovies(movies);
    //             break;
    //           default:
    //         }
    //       }
    //       break;
    //     case 'Lyrics':
    //       if (screenName === category) {
    //         lyrics.splice(itemId, 1, new_data);

    //         await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
    //         setLyrics(lyrics);
    //         //console.log('lyrics:', lyrics);
    //       } else {
    //         switch (screenName) {
    //           case 'Movie':
    //             movies.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
    //             setMovies(movies);

    //             lyrics.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
    //             setLyrics(lyrics);
    //             break;
    //           case 'Book':
    //             books.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Book', JSON.stringify(books));
    //             setBooks(books);

    //             lyrics.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
    //             setLyrics(lyrics);
    //             break;
    //           default:
    //         }
    //       }
    //       break;
    //     case 'Book':
    //       if (screenName === category) {
    //         books.splice(itemId, 1, new_data);

    //         await AsyncStorage.setItem('@Book', JSON.stringify(books));
    //         setBooks(books);
    //         //console.log('books:', books);
    //       } else {
    //         switch (screenName) {
    //           case 'Movie':
    //             movies.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Movie', JSON.stringify(movies));
    //             setMovies(movies);

    //             books.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Book', JSON.stringify(books));
    //             setBooks(books);
    //             break;
    //           case 'Lyrics':
    //             lyrics.splice(itemId, 1); //delete from previous list
    //             await AsyncStorage.setItem('@Lyrics', JSON.stringify(lyrics));
    //             setLyrics(lyrics);

    //             books.push(new_data); //add to current list
    //             await AsyncStorage.setItem('@Book', JSON.stringify(books));
    //             setBooks(books);
    //             break;
    //           default:
    //         }
    //       }
    //       break;
    //     default:
    //   }

    //   navigation.navigate('Home');
    // } catch (e) {
    //   // saving error
    //   console.log(e);
    // }
  };

  const changeList = () => {
    //console.log(preposIndex);
    setProposIndex((prevIndex) => prevIndex + 1);
    if (preposIndex % preposList.length > preposList.length - 2) {
      setProposIndex(0);
    }

    setPrepos(preposList[preposIndex]);
    //console.log(preposIndex);
  };

  const onOCRCapture = (recogonized_text) => {
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
          style={styles.textInput}
          value={contents}
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
          value={source}
          multiline
          editable
          onChangeText={(text) => setSource(text)}
        />
        <Text style={styles.textTitle}>카테고리</Text>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
          {categoryList.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.updateButton} onPress={storeData}>
          <Text style={styles.textButton}>수정하기</Text>
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  updateButton: {
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

export default Update;
