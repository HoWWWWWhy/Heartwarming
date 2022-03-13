import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';
import OpenSourceLicense from '../OpenSourceLicense';
import appStyles from '../styles';

const OpenSourceLicenseList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [libraryName, setLibraryName] = useState('');
  const [version, setVersion] = useState('');
  const [license, setLicense] = useState('');
  const [description, setDescription] = useState('');
  const [homepage, setHomepage] = useState('');
  const [licenseContent, setLicenseContent] = useState('');

  useEffect(() => {
    //console.log('OpenSourceLicenseList Mounted');
  }, []);

  const Item = ({item}) => (
    <View style={styles.listItemContainer}>
      <TouchableOpacity
        onPress={() => {
          setLibraryName(item.libraryName);
          setVersion(item.version ? item.version : '');
          setLicense(item._license ? item._license : '');
          setDescription(item._description ? item._description : '');
          setHomepage(
            item.homepage
              ? item.homepage
              : item.repository.url
              ? item.repository.url
              : '',
          );
          setLicenseContent(item._licenseContent ? item._licenseContent : '');
          setModalVisible(true);
        }}>
        <Text style={styles.listItemText}>{item.libraryName}</Text>
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

  const OpenSourceLicenseModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => {
                onPressURL(homepage);
              }}>
              <Text
                style={[styles.modalText, {textDecorationLine: 'underline'}]}>
                {libraryName}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>VERSION: {version}</Text>
            <Text style={styles.modalText}>LICENSE: {license}</Text>
            <Text style={styles.modalText}>{description}</Text>
            <Text style={styles.modalText}>{licenseContent}</Text>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      {modalVisible ? <OpenSourceLicenseModal /> : null}
      <View style={styles.listContainer}>
        <FlatList
          data={OpenSourceLicense}
          keyExtractor={item => item.libraryName}
          renderItem={({item}) => <Item item={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.backgroundColor,
  },
  listContainer: {
    flex: 1,
  },
  listItemContainer: {
    backgroundColor: appStyles.sectionItemColor,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: appStyles.borderBottomColor,
  },
  listItemText: {
    //backgroundColor: 'white',
    paddingVertical: 4,
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 10,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginVertical: 10,
  },
});

export default OpenSourceLicenseList;
