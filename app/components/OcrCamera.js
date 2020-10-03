import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {RNCamera} from 'react-native-camera';

import constants from '../constants';

export const RNCameraConstants = {
  ...RNCamera.Constants,
};

const OCR_Camera = ({
  cameraType,
  flashMode,
  autoFocus,
  whiteBalance,
  ratio,
  quality,
  imageWidth,
  enabledOCR,
  onCapture,
  onClose,
}) => {
  //let camera = null;

  const [cameraSetting, setCameraSetting] = useState({
    cameraType: RNCameraConstants.Type.back,
    flashMode: RNCameraConstants.FlashMode.off,
    recognizedText: null,
  });

  const cameraRef = useRef(null);

  useEffect(() => {
    setCameraSetting({
      cameraType: enabledOCR ? RNCameraConstants.Type.back : cameraType,
      flashMode,
      recognizedText: null,
    });
  }, []);

  const changeFlashMode = (flash_mode) => {
    switch (flash_mode) {
      case RNCameraConstants.FlashMode.off:
        setCameraSetting((prevState) => ({
          ...prevState,
          flashMode: RNCameraConstants.FlashMode.auto,
        }));
        break;

      case RNCameraConstants.FlashMode.auto:
        setCameraSetting((prevState) => ({
          ...prevState,
          flashMode: RNCameraConstants.FlashMode.on,
        }));

        break;

      case RNCameraConstants.FlashMode.on:
        setCameraSetting((prevState) => ({
          ...prevState,
          flashMode: RNCameraConstants.FlashMode.off,
        }));
        break;
    }
  };

  const takePicture = async () => {
    //console.log(cameraRef);
    if (cameraRef) {
      const options = {
        quality,
        base64: true,
        width: imageWidth,
        doNotSave: true,
        fixOrientation: true,
        pauseAfterCapture: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      //console.log(data);
      onCapture && onCapture(data.base64, cameraSetting.recognizedText);
    }
  };

  const textRecognized = (data) => {
    if (enabledOCR) {
      //console.log('onTextRecognized', data);
      if (data && data.textBlocks && data.textBlocks.length > 0) {
        setCameraSetting((prevState) => ({
          ...prevState,
          recognizedText: data,
        }));
      } else {
        setCameraSetting((prevState) => ({
          ...prevState,
          recognizedText: null,
        }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={cameraSetting.cameraType}
          flashMode={cameraSetting.flashMode}
          ratio={ratio}
          captureAudio={false}
          autoFocus={autoFocus}
          whiteBalance={whiteBalance}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onTextRecognized={
            enabledOCR ? (data) => textRecognized(data) : undefined
          }
        />
      </View>
      <View style={styles.cameraControlContainer}>
        <Text>{enabledOCR}</Text>
        <TouchableOpacity
          onPress={() => changeFlashMode(cameraSetting.flashMode)}
          style={styles.cameraControlButton}>
          <MaterialIcons
            name={
              cameraSetting.flashMode == RNCameraConstants.FlashMode.auto
                ? 'flash-auto'
                : cameraSetting.flashMode == RNCameraConstants.FlashMode.on
                ? 'flash-on'
                : 'flash-off'
            }
            size={50}
            color={'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.cameraControlButton}>
          <Icon name="circle-o" size={50} color={'black'} />
        </TouchableOpacity>
        <View
          style={[styles.cameraControlButton, {width: 70, height: 70}]}></View>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          onClose && onClose();
        }}>
        <MaterialIcons name={'close'} style={styles.closeButtonIcon} />
      </TouchableOpacity>
      {cameraSetting.recognizedText !== null
        ? cameraSetting.recognizedText.textBlocks.map((block, idx) => (
            <View
              key={'Block_' + idx}
              style={{
                position: 'absolute',
                top: block.bounds.origin.y,
                left: block.bounds.origin.x,
                width: block.bounds.size.width,
                height: block.bounds.size.height,
                borderStyle: 'solid',
                borderWidth: 2,
                borderColor: 'red',
              }}
            />
          ))
        : null}
    </View>
  );
};

OCR_Camera.propTypes = {
  cameraType: PropTypes.any,
  flashMode: PropTypes.any,
  autoFocus: PropTypes.any,
  whiteBalance: PropTypes.any,
  ratio: PropTypes.string,
  quality: PropTypes.number,
  imageWidth: PropTypes.number,
  style: PropTypes.object,
  onCapture: PropTypes.func,
  enabledOCR: PropTypes.bool,
  onClose: PropTypes.func,
};

OCR_Camera.defaultProps = {
  cameraType: RNCameraConstants.Type.back,
  flashMode: RNCameraConstants.FlashMode.off,
  autoFocus: RNCameraConstants.AutoFocus.on,
  whiteBalance: RNCameraConstants.WhiteBalance.auto,
  ratio: '4:3',
  quality: 0.5,
  imageWidth: 768,
  style: null,
  onCapture: null,
  enabledOCR: false,
  onClose: null,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'white',
  },
  cameraContainer: {
    width: constants.width,
    height: constants.height - StatusBar.currentHeight - 150,
    borderColor: 'yellow',
    borderWidth: 5,
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraControlContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderColor: 'red',
    borderWidth: 5,
    height: 100,
  },
  cameraControlButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: '#aaaaaab0',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    top: 10,
    left: 10,
  },
  closeButtonIcon: {
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    lineHeight: 40,
  },
});

export default OCR_Camera;
