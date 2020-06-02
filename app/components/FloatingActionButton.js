import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };
  const updateAnimatedStyle = {
    transform: [
      {
        scale: animation,
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -45],
        }),
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -35],
        }),
      },
    ],
  };
  const deleteAnimatedStyle = {
    transform: [
      {
        scale: animation,
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
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
          <Icon name="add" size={30} color="#01a3a4" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        disabled={props.updateDisabled}
        onPress={props.onUpdate}>
        <Animated.View
          style={[styles.button, styles.secondary, updateAnimatedStyle]}>
          <Icon
            name="create"
            size={30}
            color={props.updateDisabled ? '#c8d6e5' : '#01a3a4'}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={props.onDelete}>
        <Animated.View
          style={[styles.button, styles.secondary, deleteAnimatedStyle]}>
          <Icon
            name="delete"
            size={30}
            color={props.deleteDisabled ? '#c8d6e5' : '#01a3a4'}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <Animated.View style={[styles.button, styles.menu]}>
          {menuOpen ? (
            <Icon name="menu" size={30} color="white" />
          ) : (
            <Icon name="apps" size={30} color="white" />
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    backgroundColor: '#01a3a4',
  },
  secondary: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
  },
});

export default FloatingActionButton;
