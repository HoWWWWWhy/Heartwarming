import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Store from '../store';
import constants from '../constants';

const BgPalette = ({setting, selected}) => {
  const paletteColors = [
    'white',
    '#f6e58d',
    '#f9ca24',
    '#fab1a0',
    '#e17055',
    '#badc58',
    '#6ab04c',
    '#7ed6df',
    '#0984e3',
    '#2980b9',
    '#2c3e50',
    'black',
  ];

  const SEL_BORDER_WIDTH = 3;

  return (
    <View style={styles.paletteContainer}>
      {paletteColors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() =>
            setting((prevState) => ({
              ...prevState,
              bgColor: color,
            }))
          }>
          <View
            style={[
              styles.palette,
              {backgroundColor: color},
              {borderWidth: selected === color ? SEL_BORDER_WIDTH : 0},
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  palette: {
    width: 50,
    //width: Math.round((constants.width * 0.8) / 6 - constants.width * 0.01),
    height: 50,
    //height: Math.round((constants.width * 0.8) / 6 - constants.width * 0.01),
    margin: 5,
    //margin: Math.round(constants.width * 0.01),
    borderRadius: 25,
    // borderRadius: Math.round(
    //   ((constants.width * 0.8) / 6 - constants.width * 0.01) / 2,
    // ),
    borderColor: 'red',
  },
});

export default BgPalette;
