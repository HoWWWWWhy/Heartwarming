import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Help = () => {
  return (
    <View style={styles.container}>
      <Text>
        {`[View] 에서는 화면의 맨 위쪽 부분을 살짝 
위에서 아래로 쓸어내려주시면 메뉴 화면으로 
갈 수 있습니다.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Help;
