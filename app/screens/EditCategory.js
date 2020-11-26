import React, {Component, useState, useEffect, useContext, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import NavIcon from '../components/NavIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import constants from '../constants';
import assets from '../default_assets';

const EditCategory = ({navigation, route}) => {
  const {categories, setCategories} = useContext(Store);

  const draggableList = categories.map((category, idx) => ({
    label: Object.keys(category)[0],
    key: `category-${Object.keys(category)[0]}`,
    backgroundColor: '#f1f2f6',
  }));

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [draggableData, setDraggableData] = useState(draggableList);

  const categoryNameRef = useRef();

  useEffect(() => {
    console.log('EditCategory Mounted');
  }, []);

  const AddCategoryModal = () => {
    const [categoryName, setCategoryName] = useState('');

    const handleComplete = () => {
      const blankRemovedStr = categoryName.replace(/(\s*)/gi, ''); //모든 공백 제거
      const foundIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === categoryName.trim(),
      );
      console.log(foundIdx);
      if (blankRemovedStr.length === 0) {
        Alert.alert('카테고리 이름은 적어도 한 글자여야 합니다.');
      } else if (foundIdx >= 0) {
        Alert.alert('중복된 카테고리입니다.');
      } else {
        setAddModalVisible(!addModalVisible);
        setCategoryName('');
        addCategory(categoryName.trim());
      }
    };
    return (
      <KeyboardAvoidingView behavior={'height'}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onShow={() => {
            categoryNameRef.current.focus();
          }}
          onRequestClose={() => {
            setCategoryName('');
            setAddModalVisible(!addModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <MaterialIcons
                name="close"
                size={30}
                color={'black'}
                style={styles.modalCloseButton}
                onPress={() => {
                  setCategoryName('');
                  setAddModalVisible(!addModalVisible);
                }}
              />
              <Text style={styles.modalText}>새 카테고리명</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(text) => {
                  setCategoryName(text);
                }}
                value={categoryName}
                underlineColorAndroid="transparent"
                ref={categoryNameRef}
              />
              <TouchableHighlight
                style={styles.addModalButton}
                onPress={handleComplete}>
                <Text style={styles.textStyle}>완료</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  };

  const EditCategoryModal = () => {
    const DATA = [
      {
        title: '카테고리 편집',
        data: [
          {
            name: '수정',
            action: () => {
              //navigation.navigate('EditCategory');
            },
          },
          {
            name: '삭제',
            action: () => {
              //navigation.navigate('SettingTabList');
            },
          },
          {
            name: '취소',
            action: () => {
              //navigation.navigate('SettingTabList');
            },
          },
        ],
      },
    ];
    const Item = ({item}) => (
      <View style={styles.item}>
        <TouchableHighlight
          style={styles.editModalSelector}
          onPress={() => console.log(item.name)}>
          <Text style={styles.title}>{item.name}</Text>
        </TouchableHighlight>
      </View>
    );

    return (
      <KeyboardAvoidingView behavior={'height'}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!editModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.editCategoryModalView}>
              <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item item={item} />}
                renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.header}>{title}</Text>
                )}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  };

  const renderItem = ({item, index, drag, isActive}) => {
    return (
      <View style={styles.draggableItemContainer}>
        <TouchableOpacity
          style={{flex: 8, justifyContent: 'center'}}
          onPress={() => setEditModalVisible(!editModalVisible)}>
          <Text style={styles.draggableItemText}>{item.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.draggableItemIcon,
            {backgroundColor: item.backgroundColor},
          ]}
          onPress={() => console.log(Object.keys(categories[index])[0])}>
          <NavIcon
            focused={true}
            name={Object.values(categories[index])[0]['icon']}
            size={30}
            color={'#487eb0'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.draggableItemIcon,
            {
              backgroundColor: isActive ? '#dfe6e9' : item.backgroundColor,
            },
          ]}
          onLongPress={drag}>
          <Icon name="reorder" size={30} color={'#487eb0'} />
        </TouchableOpacity>
      </View>
    );
  };

  const addCategory = (name) => {
    let newData = [];
    let newCategory = {};
    newCategory[name] = {
      data: [],
      icon: 'person',
      setting: {
        useBgImage: true,
        bgColor: 'white',
        textColor: 'black',
        bgImage: assets.defaultNewBgImage,
        bgImageBlur: 0,
        isSelected: true,
      },
    };

    newData = [...categories, newCategory];
    setDraggableData([
      ...draggableData,
      {
        label: name,
        key: `category-${name}`,
        backgroundColor: '#f1f2f6',
      },
    ]);

    setCategories(newData);
    storeData(newData);
  };

  const reorderCategories = (draggable_data) => {
    let newData = [];

    //console.log(draggable_data);
    //console.log(categories);
    let newIdx;

    draggable_data.map((item) => {
      newIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === item['label'],
      );
      newData.push(categories[newIdx]);
    });
    setCategories(newData);
    storeData(newData);
  };

  const storeData = async (data) => {
    //console.log('storeData');
    //console.log(data);
    try {
      await AsyncStorage.setItem('@Data', JSON.stringify(data));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <AddCategoryModal />
      <EditCategoryModal />
      <DraggableFlatList
        data={draggableData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({data}) => {
          setDraggableData(data);
          reorderCategories(data);
        }}
      />
      <View>
        {!addModalVisible && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setAddModalVisible(true);
            }}>
            <NavIcon focused={true} name={'add'} size={40} color={'#487eb0'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
  },
  centeredView: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: constants.STACK_HEADER_HEIGHT,
    //backgroundColor: 'black',
  },
  modalView: {
    margin: 20,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editCategoryModalView: {
    margin: 20,
    width: '50%',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCloseButton: {
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  addModalButton: {
    backgroundColor: '#34495e',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  editModalSelector: {
    borderBottomColor: '#34495e',
    borderBottomWidth: 1,
    marginHorizontal: 5,
    padding: 10,
    width: 100,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
  modalTextInput: {
    width: 100,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  addButton: {
    //flex: 1,
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    right: 20,
  },
  draggableItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#c8d6e5',
    backgroundColor: '#f1f2f6',
  },
  draggableItemText: {
    //flex: 8,
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: 20,
    //textAlignVertical: 'center',
    //backgroundColor: 'green',
  },
  draggableItemIcon: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditCategory;
