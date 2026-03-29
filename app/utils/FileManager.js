import {Alert, Platform, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import {pick, types} from '@react-native-documents/picker';
import {RNDocumentCreator} from './NativeModules';
import assets from '../default_assets';

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
    let granted;
    let checkResult = false;
    if (Platform.OS === 'android') {
      if (Platform.Version <= 32) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      } else if (Platform.Version <= 33) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
      } else {
        //Android 14 (API level 34) or higher
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED,
        );
      }
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        checkResult = true;
        resolve(checkResult);
      } else {
        reject(new Error('Permission Denied'));
      }
    }
  });
};

const pickJsonFile = () => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const [pickResult] = await pick({
        type: [types.json],
      });
      //console.log('pickResult:', pickResult);
      //console.log('pickResult.uri:', pickResult.uri);
      try {
        const splitUri = pickResult.name.split('.');
        const checkJSON = splitUri[splitUri.length - 1] === 'json';
        if (checkJSON) {
          resolve(pickResult.uri);
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
  return promise;
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
          let bgImageNum = 1;
          let infoAlert = false;
          console.log(parsedData, isAppData);
          parsedData.data.forEach((element, index) => {
            //console.log(element['setting']);
            for (let key in element) {
              //console.log(element[key]);
              //console.log(element[key]['setting']['bgImage']);
              if (
                element[key]['setting']['bgImage'] !== 1 &&
                element[key]['setting']['bgImage'] !== 2 &&
                element[key]['setting']['bgImage'] !== 3
              ) {
                if (!infoAlert) {
                  Alert.alert(
                    '이전에 배경이미지를 설정한 경우 앱의 기본이미지로 초기화됩니다.',
                  );
                  infoAlert = true;
                }

                parsedData['data'][index][key]['setting']['bgImage'] =
                  bgImageNum;
                bgImageNum = bgImageNum + 1;
                if (bgImageNum > assets.NUM_DEFAULT_IMAGE) {
                  bgImageNum = 1;
                }
              }
            }
          });
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
