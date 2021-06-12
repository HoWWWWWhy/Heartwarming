import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

const writeFile = async (filepath, data) => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    await RNFS.writeFile(filepath, data);
    console.log('FILE CREATED!!!', res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('cancelled');
    } else {
      //throw err;
      console.log(err);
      Alert.alert(err);
    }
  }
};
export {writeFile};
