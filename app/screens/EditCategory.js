import React, {useState, useEffect, useContext, useRef} from 'react';
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
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import NavIcon from '../components/NavIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store';
import constants from '../constants';
import assets from '../default_assets';
import _ from 'lodash';

const EditCategory = ({navigation, route}) => {
  const {categories, setCategories} = useContext(Store);

  const draggableList = categories.map((category, idx) => ({
    label: Object.keys(category)[0],
    key: `category-${Object.keys(category)[0]}`,
    backgroundColor: '#f1f2f6',
  }));

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [iconListModalVisible, setIconListModalVisible] = useState(false);
  const [draggableData, setDraggableData] = useState(draggableList);
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(categories[0])[0],
  );

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
            <View style={[styles.modalView, styles.commonModalView]}>
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
              setEditModalVisible(!editModalVisible);
              setUpdateModalVisible(!updateModalVisible);
            },
          },
          {
            name: '삭제',
            action: () => {
              setEditModalVisible(!editModalVisible);
              Alert.alert(
                '카테고리 삭제',
                '카테고리 삭제 시 내용도 함께 삭제됩니다. 그래도 삭제하시겠습니까?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('OK Pressed');
                      deleteCategory(selectedCategory);
                    },
                  },
                ],
                {
                  cancelable: false,
                },
              );
            },
          },
          {
            name: '취소',
            action: () => {
              setEditModalVisible(!editModalVisible);
            },
          },
        ],
      },
    ];
    const Item = ({item}) => (
      <View style={styles.editModalItemContainer}>
        <TouchableOpacity onPress={item.action}>
          <Text style={styles.editModalItemText}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Modal
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!editModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.editCategoryModalView, styles.commonModalView]}>
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => <Item item={item} />}
              renderSectionHeader={({section: {title}}) => (
                <Text style={styles.editModalHeader}>{title}</Text>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const UpdateCategoryModal = () => {
    const [categoryName, setCategoryName] = useState(selectedCategory);

    const handleComplete = () => {
      const blankRemovedStr = categoryName.replace(/(\s*)/gi, ''); //모든 공백 제거
      const foundIdx = categories.findIndex(
        (category) => Object.keys(category)[0] === categoryName.trim(),
      );

      if (blankRemovedStr.length === 0) {
        Alert.alert('카테고리 이름은 적어도 한 글자여야 합니다.');
      } else if (foundIdx >= 0 && categoryName.trim() !== selectedCategory) {
        Alert.alert('중복된 카테고리입니다.');
      } else {
        setUpdateModalVisible(!updateModalVisible);
        setCategoryName('');
        updateCategory(categoryName.trim());
      }
    };
    return (
      <KeyboardAvoidingView behavior={'height'}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={updateModalVisible}
          onShow={() => {
            categoryNameRef.current.focus();
          }}
          onRequestClose={() => {
            setCategoryName('');
            setUpdateModalVisible(!updateModalVisible);
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
                  setUpdateModalVisible(!updateModalVisible);
                }}
              />
              <Text style={styles.modalText}>수정할 카테고리명</Text>
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

  const IconListModal = () => {
    const ICON_DATA = [
      {id: 1, title: 'movie'},
      {id: 2, title: 'library-music'},
      {id: 3, title: 'library-books'},
      {id: 4, title: 'ac-unit'},
      {id: 5, title: 'brush'},
      {id: 6, title: 'color-lens'},
      {id: 7, title: 'camera'},
      {id: 8, title: 'chat'},
      {id: 9, title: 'audiotrack'},
      {id: 10, title: 'child-care'},
      {id: 11, title: 'beach-access'},
      {id: 12, title: 'cloud-circle'},
      {id: 13, title: 'bookmark'},
      {id: 14, title: 'business-center'},
      {id: 15, title: 'code'},
      {id: 16, title: 'collections'},
      {id: 17, title: 'album'},
      {id: 18, title: 'create'},
      {id: 19, title: 'email'},
      {id: 20, title: 'person'},
      {id: 21, title: 'group'},
      {id: 22, title: 'face'},
      {id: 23, title: 'favorite-border'},
      {id: 24, title: 'favorite'},
      {id: 25, title: 'fiber-new'},
      {id: 26, title: 'fingerprint'},
      {id: 27, title: 'flag'},
      {id: 28, title: 'folder-special'},
      {id: 29, title: 'g-translate'},
      {id: 30, title: 'gesture'},
      {id: 41, title: 'gps-fixed'},
      {id: 42, title: 'golf-course'},
      {id: 43, title: 'extension'},
      {id: 44, title: 'headset'},
      {id: 45, title: 'healing'},
      {id: 46, title: 'highlight'},
      {id: 47, title: 'home'},
      {id: 48, title: 'hot-tub'},
      {id: 49, title: 'hotel'},
      {id: 50, title: 'https'},
    ];

    const curIdx = categories.findIndex(
      (obj) => Object.keys(obj)[0] === selectedCategory,
    );

    //console.log(Object.values(categories[curIdx])[0]['icon']);

    const [selectedId, setSelectedId] = useState(
      ICON_DATA.findIndex(
        (item) => item.title === Object.values(categories[curIdx])[0]['icon'],
      ) + 1,
    );

    const Item = ({item, onPress, style, color}) => (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.iconListElement, style]}>
        <NavIcon focused={true} name={item.title} size={30} color={color} />
      </TouchableOpacity>
    );

    const renderItem = ({item}) => {
      const backgroundColor = item.id === selectedId ? '#95afc0' : 'white';
      const iconColor = '#487eb0';
      return (
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.id);
            Alert.alert(
              '탭 아이콘 변경',
              '현재 선택된 아이콘으로 변경하시겠습니까?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    updateCategoryIcon(selectedCategory, item.title);
                    setIconListModalVisible(!iconListModalVisible);
                  },
                },
              ],
              {
                cancelable: false,
              },
            );
          }}
          style={{backgroundColor}}
          color={iconColor}
        />
      );
    };

    return (
      <Modal
        transparent={true}
        visible={iconListModalVisible}
        onRequestClose={() => {
          setIconListModalVisible(!iconListModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.iconListModalView, styles.commonModalView]}>
            <FlatList
              data={ICON_DATA}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.title}-${item.id}`}
              extraData={selectedId}
              numColumns="8"
            />
          </View>
        </View>
      </Modal>
    );
  };

  const updateCategoryIcon = (category_name, icon_name) => {
    //console.log('updateCategoryIcon');
    //console.log(category_name, icon_name);
    let newData = _.cloneDeep(categories);
    newData.map((obj) => {
      if (category_name === Object.keys(obj)[0]) {
        Object.values(obj)[0]['icon'] = icon_name;
      }
    });

    setCategories(newData);
    storeData(newData);
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

  const renameKey = (obj, old_key, new_key) => {
    // check if old key = new key
    if (old_key !== new_key) {
      Object.defineProperty(
        obj,
        new_key, // modify old key
        // fetch description from object
        Object.getOwnPropertyDescriptor(obj, old_key),
      );
      delete obj[old_key]; // delete old key
    }
  };

  const updateCategory = (name) => {
    //console.log('UpdateCategory', name);
    let newData = _.cloneDeep(categories);
    newData.map((obj) => {
      if (selectedCategory === Object.keys(obj)[0]) {
        console.log(obj);
        renameKey(obj, selectedCategory, name);
      }
    });

    let newDraggableData = _.cloneDeep(draggableData);
    newDraggableData.map((obj) => {
      //console.log(obj['label']);
      if (selectedCategory === obj['label']) {
        //console.log(obj);
        obj['label'] = name;
      }
    });
    //console.log(newData);
    //console.log(newDraggableData);
    //console.log(draggableData);

    setDraggableData(newDraggableData);
    setCategories(newData);
    storeData(newData);
  };

  const deleteCategory = (name) => {
    //console.log('DeleteCategory', name);
    //console.log(categories);

    let newIdx;

    let newData = _.cloneDeep(categories);
    newIdx = newData.findIndex((obj) => Object.keys(obj)[0] === name);
    newData.splice(newIdx, 1);

    let newDraggableData = _.cloneDeep(draggableData);
    newIdx = newDraggableData.findIndex((item) => item['label'] === name);
    newDraggableData.splice(newIdx, 1);

    setDraggableData(newDraggableData);
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

  const renderItem = ({item, index, drag, isActive}) => {
    return (
      <View style={styles.draggableItemContainer}>
        <TouchableOpacity
          style={{flex: 8, justifyContent: 'center'}}
          onPress={() => {
            console.log(item.label);
            setSelectedCategory(item.label);
            setEditModalVisible(!editModalVisible);
          }}>
          <Text style={styles.draggableItemText}>{item.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.draggableItemIcon,
            {backgroundColor: item.backgroundColor},
          ]}
          onPress={() => {
            console.log(Object.keys(categories[index])[0]);
            setSelectedCategory(item.label);
            setIconListModalVisible(!iconListModalVisible);
          }}>
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
              backgroundColor: isActive ? '#487eb0' : item.backgroundColor,
            },
          ]}
          onLongPress={drag}>
          <FontAwesome
            name="reorder"
            size={30}
            color={isActive ? 'white' : '#487eb0'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AddCategoryModal />
      <IconListModal />
      <EditCategoryModal />
      <UpdateCategoryModal />

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
        {!addModalVisible && !updateModalVisible && (
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'black',
  },
  modalView: {
    marginTop: constants.STACK_HEADER_HEIGHT,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  editCategoryModalView: {
    width: constants.width / 1.5,
  },
  iconListModalView: {
    backgroundColor: 'white',
    borderColor: '#c8d6e5',
    borderWidth: 1,
    height: 185.2,
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
  editModalHeader: {
    width: constants.width / 1.5,
    fontSize: 16,
    backgroundColor: '#34495e',
    color: 'white',
    paddingVertical: 5,
    paddingLeft: 10,
  },
  editModalItemContainer: {
    //flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  editModalItemText: {
    flex: 1,
    fontSize: 18,
    color: '#34495e',
  },
  iconListElement: {
    padding: 2,
    borderWidth: 1,
    borderColor: '#c8d6e5',
  },
});

export default EditCategory;
