import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import NavIcon from '../components/NavIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Store from '../store';

const EditCategory = ({navigation, route}) => {
  const {categories, setCategories} = useContext(Store);

  const draggableList = categories.map((category, idx) => ({
    label: Object.keys(category)[0],
    key: `category-${Object.keys(category)[0]}`,
    backgroundColor: '#f1f2f6',
  }));

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
            backgroundColor: isActive ? '#dfe6e9' : item.backgroundColor,
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
      <DraggableFlatList
        data={draggableData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({data}) => {
          setDraggableData(data);
          reorderCategories(data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
  },
  contentsContainer: {
    flexDirection: 'row',
  },
  cameraButton: {
    width: 20,
    height: 20,
    //backgroundColor: 'white',
    marginHorizontal: 5,
  },

  preposContainer: {
    flexDirection: 'row',
  },
});

export default EditCategory;
