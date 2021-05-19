import React, {useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  SectionList,
} from 'react-native';
import appStyles from '../styles';
import Store from '../store';

import RNFS from 'react-native-fs';
import realm, {
  addCategory,
  getAllCategories,
  deleteAllCategories,
  closeRealm,
} from '../database/schema';

const Setting = ({navigation}) => {
  const URL_EMAIL = 'mailto:howwwwwhy@gmail.com';
  const URL_GOOGLEPLAY =
    'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming';
  const URL_PRIVACY = 'https://howwwwwhy.github.io/Heartwarming_privacy';

  const {categories, setCategories} = useContext(Store);

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
          action: async () => {
            console.log('내보내기');
            //Alert.alert('준비 중인 기능입니다 :)');

            categories.map((category, idx) => {
              const curTitle = Object.keys(category)[0];
              const curIcon = category[Object.keys(category)[0]]['icon'];
              const curData = category[Object.keys(category)[0]]['data'];
              const curSetting = category[Object.keys(category)[0]]['setting'];
              const curCategory = {
                icon: curIcon,
                data: curData,
                setting: curSetting,
              };
              console.log(idx, curTitle, curIcon);
              //console.log(curCategory);

              addCategory(idx, curTitle, curCategory);

            });

           

            try {            
              await RNFS.copyFile(
              '//data//data//com.howwwwwhy.heartwarming//files//test1.realm',
              RNFS.DownloadDirectoryPath + '//test1.realm',
            );
            } catch (err) {
              console.log(err);
            }
            deleteAllCategories();
            
            //closeRealm();
          },
        },
        {
          name: '가져오기',
          action: () => {
            Alert.alert('준비 중인 기능입니다 :)');
            //console.log('가져오기');
            const testCategory = getAllCategories();
            console.log(testCategory);
          },
        },
        {
          name: '초기화',
          action: () => {
            Alert.alert('준비 중인 기능입니다 :)');
            //console.log('초기화');
            //deleteAllCategories();
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
});

export default Setting;
