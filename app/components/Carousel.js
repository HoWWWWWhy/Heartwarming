import React, {useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';

const Carousel = ({offset, gap, pageWidth, pages}) => {
  const [pageNum, setPageNum] = useState(0);

  const renderItem = ({item}) => (
    <View
      style={{
        width: pageWidth,
        marginHorizontal: gap / 2,
        justifyContent: 'center',
        alignItems: 'center',
        //borderRadius: 10,
        //backgroundColor: item.color,
      }}>
      <ImageBackground
        source={item.image}
        resizeMode="contain"
        style={styles.image}></ImageBackground>
    </View>
  );

  const Indicator = ({focused}) => {
    //console.log(focused);
    return (
      <View
        style={focused ? styles.selectedIndicator : styles.indicator}></View>
    );
  };

  const onScroll = event => {
    //console.log(event.nativeEvent.contentOffset.x);
    //console.log(event.nativeEvent.contentOffset.x / (pageWidth + gap));
    const newPageNum = Math.round(
      event.nativeEvent.contentOffset.x / (pageWidth + gap),
    );
    //console.log(newPageNum);
    setPageNum(newPageNum);
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: offset + gap / 2,
          }}
          data={pages}
          horizontal
          keyExtractor={item => `page_${item.title}`}
          onScroll={onScroll}
          renderItem={renderItem}
          pagingEnabled
          snapToInterval={pageWidth + gap}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.indicatorWrapper}>
        {Array.from({length: pages.length}, (_, i) => i).map(index => (
          <Indicator key={`indicator_${index}`} focused={index === pageNum} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'white',
  },
  item: {
    //backgroundColor: 'yellow',
    flex: 9.5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  indicatorWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
    //backgroundColor: 'green',
  },
  indicator: {
    marginHorizontal: 4,
    marginVertical: 0,
    backgroundColor: '#74b9ff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectedIndicator: {
    marginHorizontal: 4,
    marginVertical: 0,
    backgroundColor: '#3c6382',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default Carousel;
