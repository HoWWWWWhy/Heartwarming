import Config from 'react-native-config';

const config = {
  screens: {
    //Home: 'kakaolink',

    Home: {
      //path: 'home/:from/:to/:contents/:prepos/:source',
      path: 'kakaolink',
      parse: {
        from: from => `${from}`,
        to: to => `${to}`,
        contents: contents => `${contents}`,
        prepos: prepos => `${prepos}`,
        source: source => `${source}`,
      },
    },
  },
};

const linking = {
  prefixes: ['kakao' + Config.KAKAO_NATIVE_APP_KEY + '://'],
  config,
};

export default linking;
