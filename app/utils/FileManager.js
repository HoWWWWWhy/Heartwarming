import {Alert, Platform, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {RNDocumentCreator} from './NativeModules';

/* ----- saved json format start -----
{
  "symbol": "heartwarming",
  "data": []
}
   ----- saved json format end ------- */

const exportData = async (fileName, data) => {
  await RNDocumentCreator.createDocument(fileName, 'json');
  /*
  let filePath = RNFS.DownloadDirectoryPath;
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted: WRITE_EXTERNAL_STORAGE');
        console.log('Platform Version is:', Platform.Version);
        if (Platform.Version >= 21) {
          const selectedDir = await DocumentPicker.pickDirectory();
          console.log(selectedDir['uri']);
          //filePath = selectedDir['uri'];

          console.log('converted filepath:', RNFS.stat(selectedDir['uri']));
        }

        filePath = filePath + '/' + fileName + '.json';
        console.log('final path:', filePath);

        //await RNFS.writeFile(filePath, data);
        //console.log('FILE CREATED!!!', res.uri); -> Toast message로 보여주기
      } else {
        console.log('Permission Denied: WRITE_EXTERNAL_STORAGE');
      }
    }
  } catch (err) {
    console.log(err);
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('cancelled');
    } else {
      Alert.alert(JSON.stringify(err['message']));
    }
  }
  */
};

// 앱으로부터 만들어진 파일인지 체크하는 기능 추가. symbol 체크
const importData = async (setCategories) => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted: READ_EXTERNAL_STORAGE');

        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.json],
        });
        console.log(res.uri);

        try {
          const splitUri = res.uri.split('.');
          const checkJSON = splitUri[splitUri.length - 1] === 'json';

          if (checkJSON) {
            const data = await RNFS.readFile(res.uri);
            console.log(JSON.parse(data));
            setCategories(JSON.parse(data));
            AsyncStorage.setItem('@Data', data);
          } else {
            Alert.alert('확장자가 json인 파일을 선택하세요');
          }
        } catch (err) {
          Alert.alert(JSON.stringify(err['message']));
        }
      } else {
        console.log('Permission Denied: READ_EXTERNAL_STORAGE');
      }
    }
  } catch (err) {
    console.log(err);
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('cancelled');
    } else {
      Alert.alert(JSON.stringify(err['message']));
    }
  }
};

export {exportData, importData};
