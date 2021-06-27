import {Alert, Platform, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {RNDocumentCreator} from './NativeModules';

/* ----- saved json format start ----- */
const APP_SYMBOL = 'heartwarming';
const savedJsonFormat = {
  symbol: APP_SYMBOL,
  data: [],
};
/* ----- saved json format end ------- */

const putData = (data) => {
  savedJsonFormat['data'] = data;
};

const checkAppData = (data) => {
  const hasKeySymbol = data.hasOwnProperty('symbol');
  const hasKeyData = data.hasOwnProperty('data');
  let checkSymbol = false;
  if (hasKeySymbol) {
    checkSymbol = data['symbol'] === APP_SYMBOL;
  }

  const checkResult = hasKeySymbol & hasKeyData & checkSymbol;
  if (!checkResult) {
    Alert.alert('Heartwarming App 파일이 아닙니다.');
  }
  return checkResult;
};

const checkReadPermission = () => {
  return new Promise(async (resolve, reject) => {
    let checkResult = false;
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted: READ_EXTERNAL_STORAGE');
        checkResult = true;
        resolve(checkResult);
      } else {
        console.log('Permission Denied: READ_EXTERNAL_STORAGE');
        reject(new Error('Permission Denied: READ_EXTERNAL_STORAGE'));
      }
    }
  });
};

const pickJsonFile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.json],
      });
      console.log(res.uri);
      resolve(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log(err);
      } else {
        console.log(err);
        Alert.alert(JSON.stringify(err['message']));
      }
      resolve(null);
    }
  });
};

const exportData = async (fileName, data) => {
  try {
    putData(data);
    //console.log(JSON.stringify(savedJsonFormat));

    const result = await RNDocumentCreator.createDocument(
      fileName,
      'json',
      JSON.stringify(savedJsonFormat),
    );
    console.log('create document result:', result); //0: success
  } catch (err) {
    console.log(err);
  }
};

// 앱으로부터 만들어진 파일인지 체크하는 기능 추가. symbol 체크
const importData = async () => {
  let data = [];
  try {
    const grantedReadPermission = await checkReadPermission();

    if (grantedReadPermission) {
      const pickedJsonFile = await pickJsonFile();
      if (pickedJsonFile !== null) {
        try {
          const splitUri = pickedJsonFile.split('.');
          const checkJSON = splitUri[splitUri.length - 1] === 'json';
          if (checkJSON) {
            const pickedData = await RNFS.readFile(pickedJsonFile);
            const parsedData = JSON.parse(pickedData);
            const isAppData = checkAppData(parsedData);
            //console.log(parsedData, isAppData);
            if (isAppData) {
              data = parsedData['data'];
            }
          } else {
            Alert.alert('확장자가 json인 파일을 선택하세요.');
          }
        } catch (err) {
          Alert.alert(JSON.stringify(err['message']));
        }
      }
    }
  } catch (err) {
    console.log(err);
    Alert.alert(JSON.stringify(err['message']));
  }
  return data;
};

export {exportData, importData};
