import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Linking,
  SectionList,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';

import appStyles from '../styles';
import Store from '../store';

import {exportData, importData} from '../utils/FileManager';

const Setting = ({navigation}) => {
  const URL_EMAIL = 'mailto:howwwwwhy@gmail.com';
  const URL_GOOGLEPLAY =
    'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming';
  const URL_PRIVACY = 'https://howwwwwhy.github.io/Heartwarming_privacy';

  const {categories, setCategories} = useContext(Store);
  const [modalVisible, setModalVisible] = useState(false);
  const fileNameRef = useRef();

  const FileSaveModal = () => {
    const [fileName, setFileName] = useState('heartwarming');

    const handleSave = () => {
      setModalVisible(!modalVisible);
      exportData(fileName, JSON.stringify(categories));
    };
    return (
      <KeyboardAvoidingView behavior={'height'}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.bottomView}>
            <View style={[styles.modalView, styles.commonModalView]}>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(text) => {
                  setFileName(text);
                }}
                value={fileName}
                underlineColorAndroid="black"
                ref={fileNameRef}
              />
              <TouchableHighlight
                style={styles.modalButton}
                onPress={handleSave}>
                <Text style={styles.textStyle}>저장</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  };

  const DATA = [
    {
      title: '기본 설정',
      data: [
        {
          name: '카테고리 편집',
          action: () => {
            navigation.navigate('EditCategory');
          },
        },
        {
          name: '탭 디자인 설정',
          action: () => {
            navigation.navigate('SettingTabList');
          },
        },
      ],
    },
    {
      title: '데이터 관리',
      data: [
        {
          name: '내보내기',
          action: () => {
            //console.log('내보내기');
            //Alert.alert('준비 중인 기능입니다 :)');
            setModalVisible(true);
          },
        },
        {
          name: '가져오기',
          action: () => {
            //console.log('가져오기');
            //Alert.alert('준비 중인 기능입니다 :)');
            importData(setCategories);
          },
        },
        {
          name: '초기화',
          action: () => {
            //console.log('초기화');
            Alert.alert('준비 중인 기능입니다 :)');
          },
        },
      ],
    },
    {
      title: '정보',
      data: [
        {
          name: '도움말',
          action: () => {
            navigation.navigate('Help');
          },
        },
        {
          name: '개발자 문의 및 제안하기',
          action: () => {
            onPressURL(URL_EMAIL);
          },
        },
        {
          name: 'Google Play 평가하기',
          action: () => {
            onPressURL(URL_GOOGLEPLAY);
          },
        },
        {
          name: '최신 버전 확인',
          action: () => {
            onPressURL(URL_GOOGLEPLAY);
          },
        },
        {
          name: '개인정보처리방침',
          action: () => {
            onPressURL(URL_PRIVACY);
          },
        },
      ],
    },
  ];

  useEffect(() => {
    //console.log('Setting Mounted');
  }, []);

  const Item = ({item}) => (
    <View style={styles.sectionItemContainer}>
      <TouchableOpacity onPress={item.action}>
        <Text style={styles.sectionItemText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const onPressURL = async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <Item item={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
      {modalVisible ? <FileSaveModal /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.backgroundColor,
  },
  sectionHeader: {
    fontSize: 16,
    backgroundColor: appStyles.sectionHeaderColor,
    color: appStyles.sectionHeaderTextColor,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sectionItemContainer: {
    backgroundColor: appStyles.sectionItemColor,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: appStyles.borderBottomColor,
  },
  sectionItemText: {
    fontSize: 18,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'black',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  commonModalView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: appStyles.sectionItemTextColor,
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 10,
  },
  modalText: {
    textAlign: 'center',
  },
  modalTextInput: {
    width: '80%',
    height: 50,

    //borderColor: 'gray',
    //borderBottomWidth: 1,
    marginVertical: 5,
    marginRight: 5,
  },
});

export default Setting;
