const config = {
  screens: {
    initialRouteName: 'Home',
    Home: 'home',
    Setting: 'setting',
    Add: {
      path: 'add/:from/:contents/:source',
      parse: {
        from: (from) => `${from}`,
        contents: (contents) => `${contents}`,
        source: (source) => `${source}`,
      },
    },
  },
};

const linking = {
  prefixes: ['heartwarming://'],
  config,
};

export default linking;
