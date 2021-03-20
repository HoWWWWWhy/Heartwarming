const config = {
  screens: {
    Home: 'home',
    Setting: 'setting',
    Add: {
      path: 'add/:from/:contents/:source',
      initialRouteName: 'home',
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
