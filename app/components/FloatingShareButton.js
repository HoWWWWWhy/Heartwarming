import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import constants from '../constants';
import appStyles from '../styles';

const FloatingShareButton = (props) => {
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

  const giftAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
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

  const textAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 45],
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

  const imageAnimatedStyle = {
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 65],
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
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={props.onShareByGift}>
        <Animated.View
          style={[styles.button, styles.secondary, giftAnimatedStyle]}>
          <FontAwesome
            name="gift"
            size={30}
            color={appStyles.shareButtonColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={props.onShareByText}>
        <Animated.View
          style={[styles.button, styles.secondary, textAnimatedStyle]}>
          <MaterialIcons
            name="text-fields"
            size={30}
            color={appStyles.shareButtonColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={props.onShareByImage}>
        <Animated.View
          style={[styles.button, styles.secondary, imageAnimatedStyle]}>
          <FontAwesome
            name="picture-o"
            size={30}
            color={appStyles.shareButtonColor}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <View style={[styles.button, styles.menu]}>
          <MaterialIcons name="share" size={30} color="white" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: Math.round(constants.width / 2.0) - 20,
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
    backgroundColor: appStyles.shareButtonColor,
  },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
  },
});

export default FloatingShareButton;
