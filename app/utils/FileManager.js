import {Alert, Platform, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

const writeFile = async (filepath, data) => {
  try {
    console.log(filepath);
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted: WRITE_EXTERNAL_STORAGE');

        const res = DocumentPicker.pick({
          type: [DocumentPicker.types.json],
        });

        await RNFS.writeFile(filepath, data);
      } else {
        console.log('Permission Denied: WRITE_EXTERNAL_STORAGE');
      }
    }

    //console.log('FILE CREATED!!!', res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('cancelled');
    } else {
      //throw err;
      console.log(err);
      //Alert.alert(err);
    }
  }
};
export {writeFile};
