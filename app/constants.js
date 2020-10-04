import {Dimensions} from 'react-native';

//const {width, height} = Dimensions.get('screen');
const {width, height} = Dimensions.get('window');
const STACK_HEADER_HEIGHT = 56;

export default {width, height, STACK_HEADER_HEIGHT};

// -------------------- width,  height reference ---------------
// LGE Nexus 5:         360     592
// Samsung SM-G935S:    360     640
