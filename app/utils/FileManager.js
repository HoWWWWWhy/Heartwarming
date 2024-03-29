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

const putData = data => {
  savedJsonFormat['data'] = data;
};

const checkAppData = data => {
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
      console.log('res:', res);
      console.log('res.uri:', res[0].uri);
      try {
        const splitUri = res[0].name.split('.');
        const checkJSON = splitUri[splitUri.length - 1] === 'json';
        if (checkJSON) {
          resolve(res[0].uri);
        } else {
          Alert.alert('확장자가 json인 파일을 선택하세요.');
          resolve(null);
        }
      } catch (error) {
        Alert.alert(JSON.stringify(err['message']));
        resolve(null);
      }
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
          const pickedData = await RNFS.readFile(pickedJsonFile);
          const parsedData = JSON.parse(pickedData);
          const isAppData = checkAppData(parsedData);
          //console.log(parsedData, isAppData);
          if (isAppData) {
            data = parsedData['data'];
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

const createFileName = header => {
  const paddingSize = 2;
  const paddingChar = '0';

  const year = new Date().getFullYear().toString(); //To get the Current Year

  let month = new Date().getMonth() + 1; //To get the Current Month
  month = month.toString().padStart(paddingSize, paddingChar);

  let date = new Date().getDate(); //To get the Current Date
  date = date.toString().padStart(paddingSize, paddingChar);

  let hour = new Date().getHours(); //To get the Current Hours
  hour = hour.toString().padStart(paddingSize, paddingChar);

  let min = new Date().getMinutes(); //To get the Current Minutes
  min = min.toString().padStart(paddingSize, paddingChar);

  let sec = new Date().getSeconds(); //To get the Current Seconds
  sec = sec.toString().padStart(paddingSize, paddingChar);

  const createdFileName = header + '_' + year + month + date + hour + min + sec;

  //console.log(createdFileName);

  return createdFileName;
};

export {exportData, importData, createFileName};
