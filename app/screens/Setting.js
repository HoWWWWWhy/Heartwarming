import React, {useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  SectionList,
  //LogBox,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import appStyles from '../styles';
import Store from '../store';
import {init_categories} from '../database/schema';

import {exportData, importData, createFileName} from '../utils/FileManager';
import {MyBannerAd, BannerAdMaxHeight} from '../components/GoogleAdmob';

// temporary code
// LogBox.ignoreLogs([
//   'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
// ]);

const Setting = ({navigation}) => {
  const URL_EMAIL = 'mailto:howwwwwhy@gmail.com';
  const URL_GOOGLEPLAY =
    'https://play.google.com/store/apps/details?id=com.howwwwwhy.heartwarming';
  const URL_PRIVACY = 'https://howwwwwhy.github.io/Heartwarming_privacy';

  const {categories, setCategories, isPremiumUser} = useContext(Store);

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
            const createdFileName = createFileName('heartwarming_config');
            console.log(createdFileName);
            //exportData(createdFileName, JSON.stringify(categories));
            exportData(createdFileName, categories);
          },
        },
        {
          name: '가져오기',
          action: async () => {
            //console.log('가져오기');
            const importedData = await importData(setCategories);
            console.log('imported data:', importedData);
            if (importedData.length > 0) {
              setCategories(importedData);
              AsyncStorage.setItem('@Data', JSON.stringify(importedData));
            }
          },
        },
        {
          name: '초기화',
          action: () => {
            //console.log('초기화');
            console.log('init:', init_categories);

            Alert.alert(
              '데이터 초기화',
              '모든 데이터가 삭제되고 복구될 수 없습니다. \n[내보내기] -> [가져오기] 기능을 통해 데이터 복구가 가능합니다. 계속 진행할까요?',
              [
                {
                  text: 'Cancel',
                  //onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () => {
                    //console.log('OK Pressed');
                    try {
                      await AsyncStorage.setItem(
                        '@Data',
                        JSON.stringify(init_categories),
                      );
                      setCategories(init_categories);
                    } catch (err) {
                      // saving error
                      console.log(err);
                    }
                  },
                },
              ],
              {
                cancelable: false,
              },
            );
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
        {
          name: '오픈소스 라이선스',
          action: () => {
            navigation.navigate('OpenSourceLicenseList');
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

  const onPressURL = async url => {
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
      <View style={styles.listContainer}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <Item item={item} />}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      </View>

      {!isPremiumUser && (
        <View style={styles.bannerAdContainer}>
          <MyBannerAd />
        </View>
      )}
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
  listContainer: {
    flex: 1,
  },
  bannerAdContainer: {
    marginTop: 0,
    height: BannerAdMaxHeight,
  },
});

export default Setting;
