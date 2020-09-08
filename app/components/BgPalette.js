import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';

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
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
      </ScrollView>
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
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    borderColor: 'red',
  },
});

export default BgPalette;
