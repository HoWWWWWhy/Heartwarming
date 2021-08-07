import assets from '../default_assets';

const init_categories = [
  {
    Movie: {
      icon: 'movie',
      data: [],
      setting: {
        useBgImage: true,
        bgColor: 'white',
        textColor: 'black',
        bgImage: assets.defaultMovieBgImage,
        bgImageBlur: 0,
        isSelected: true,
      },
    },
  },
  {
    Lyrics: {
      icon: 'library-music',
      data: [],
      setting: {
        useBgImage: true,
        bgColor: 'white',
        textColor: 'black',
        bgImage: assets.defaultLyricsBgImage,
        bgImageBlur: 0,
        isSelected: true,
      },
    },
  },
  {
    Book: {
      icon: 'library-books',
      data: [],
      setting: {
        useBgImage: true,
        bgColor: 'white',
        textColor: 'black',
        bgImage: assets.defaultBookBgImage,
        bgImageBlur: 0,
        isSelected: true,
      },
    },
  },
];

export {init_categories};
