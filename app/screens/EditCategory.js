import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
} from 'react-native';
import NavIcon from '../components/NavIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Store from '../store';
import constants from '../constants';

const EditCategory = ({navigation, route}) => {
  const {categories, setCategories} = useContext(Store);

  const draggableList = categories.map((category, idx) => ({
    label: Object.keys(category)[0],
    key: `category-${Object.keys(category)[0]}`,
    backgroundColor: '#f1f2f6',
  }));

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [draggableData, setDraggableData] = useState(draggableList);

  const renderItem = ({item, index, drag, isActive}) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#c8d6e5',
          backgroundColor: '#f1f2f6',
        }}>
        <Text
          style={{
            flex: 8,
            fontWeight: 'bold',
            color: '#34495e',
            fontSize: 24,
            textAlignVertical: 'center',
            paddingLeft: 16,
            //backgroundColor: 'green',
          }}>
          {item.label}
        </Text>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            backgroundColor: item.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => console.log(Object.keys(categories[index])[0])}>
          <NavIcon
            focused={true}
            name={Object.values(categories[index])[0]['icon']}
            size={30}
            color={'#487eb0'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            backgroundColor: isActive ? '#dfe6e9' : item.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onLongPress={drag}>
          <Icon name="reorder" size={30} color={'#487eb0'} />
        </TouchableOpacity>
      </View>
    );
  };

  const AddCategoryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('창을 닫아주세요');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>새 카테고리명</Text>
            <TextInput
              style={styles.modalTextInput}
              onChangeText={(text) => setCategoryName(text)}
              value={categoryName}
            />
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                addCategory();
              }}>
              <Text style={styles.textStyle}>완료</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  };

  const addCategory = () => {
    let newCategory = {};
    newCategory[categoryName] = {icon: 'person'};

    setDraggableData([
      ...draggableData,
      {
        label: categoryName,
        key: `category-${categoryName}`,
        backgroundColor: '#f1f2f6',
      },
    ]);
    setCategories([...categories, newCategory]);
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
  };

  return (
    <View style={styles.container}>
      <AddCategoryModal />
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
        <TouchableOpacity
          style={{
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
          }}
          onPress={() => {
            setModalVisible(true);
          }}>
          <NavIcon focused={true} name={'add'} size={40} color={'#487eb0'} />
        </TouchableOpacity>
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
    marginTop: constants.STACK_HEADER_HEIGHT,
    //backgroundColor: 'black',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#34495e',
    borderRadius: 5,
    marginTop: 10,
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
});

export default EditCategory;