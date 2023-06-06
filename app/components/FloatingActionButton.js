import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import constants from '../constants';
import appStyles from '../styles';

const FloatingActionButton = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = menuOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 7,
      useNativeDriver: true,
    }).start();

    setMenuOpen(!menuOpen);
  };

  const addAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 5],
        }),
      },
    ],
  };

  const updateAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -45],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -45],
        }),
      },
    ],
  };

  const deleteAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -55],
        }),
      },
    ],
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={props.onCreate}>
        <Animated.View
          style={[styles.button, styles.secondary, addAnimatedStyle]}>
          <MaterialIcons
            name="add"
            size={30}
            color={appStyles.actionButtonColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        disabled={props.updateDisabled}
        onPress={props.onUpdate}>
        <Animated.View
          style={[styles.button, styles.secondary, updateAnimatedStyle]}>
          <MaterialIcons
            name="create"
            size={30}
            color={
              props.updateDisabled
                ? appStyles.buttonDisabledColor
                : appStyles.actionButtonColor
            }
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        disabled={props.deleteDisabled}
        onPress={props.onDelete}>
        <Animated.View
          style={[styles.button, styles.secondary, deleteAnimatedStyle]}>
          <MaterialIcons
            name="delete"
            size={30}
            color={
              props.deleteDisabled
                ? appStyles.buttonDisabledColor
                : appStyles.actionButtonColor
            }
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <View style={[styles.button, styles.menu]}>
          {menuOpen ? (
            <MaterialIcons name="menu" size={30} color="white" />
          ) : (
            <MaterialIcons name="apps" size={30} color="white" />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    //width: Math.round(constants.width / 2.0) - 20,
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appStyles.actionButtonColor,
  },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
  },
});

export default FloatingActionButton;
