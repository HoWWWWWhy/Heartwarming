import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Store from '../store';
import _ from 'lodash';

const SettingTabList = ({navigation}) => {
  const {categories, setCategories} = useContext(Store);

  const DATA = categories.map((category, idx) => ({
    id: `setting-${Object.keys(category)[0]}`,
    title: Object.keys(category)[0],
    idx,
  }));

  const settingEditIcon = {
    name: 'edit',
    color: '#535c68',
  };

  useEffect(() => {
    console.log('SettingTabList Mounted');
    //console.log(categories);
  }, [categories]);

  const Item = ({title, idx}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>

      <View style={styles.buttonContainer}>
        <CheckBox
          disabled={false}
          value={categories[idx][title]['setting'].isSelected}
          onValueChange={() => {
            let newData = _.cloneDeep(categories);
            newData[idx][title]['setting'].isSelected = !newData[idx][title][
              'setting'
            ].isSelected;
            setCategories(newData);
            storeData(newData);
          }}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditTabScreen', {screenName: title})
          }>
          <Icon
            name={settingEditIcon.name}
            size={25}
            color={settingEditIcon.color}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('@Data', JSON.stringify(data));
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Item title={item.title} idx={item.idx} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#f1f2f6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    //backgroundColor: 'yellow',
  },
});

export default SettingTabList;
