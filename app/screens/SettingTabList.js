import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

import appStyles from '../styles';

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
    color: appStyles.sectionItemTextColor,
  };

  useEffect(() => {
    //console.log('SettingTabList Mounted');
  }, []);

  const Item = ({title, idx}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>

      <View style={styles.buttonContainer}>
        <CheckBox
          disabled={false}
          tintColors={{
            true: appStyles.sectionItemTextColor,
            false: appStyles.sectionItemTextColor,
          }}
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
    backgroundColor: appStyles.backgroundColor,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appStyles.sectionItemColor,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: appStyles.borderBottomColor,
  },
  itemText: {
    fontWeight: 'bold',
    color: appStyles.sectionItemTextColor,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    //backgroundColor: 'yellow',
  },
});

export default SettingTabList;
