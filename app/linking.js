const config = {
  screens: {
    Home: {
      path: 'home/:from/:to/:contents/:prepos/:source',
      parse: {
        from: (from) => `${from}`,
        to: (to) => `${to}`,
        contents: (contents) => `${contents}`,
        prepos: (prepos) => `${prepos}`,
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
