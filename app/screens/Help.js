import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import appStyles from '../styles';

const Help = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          0. Heartwarming 앱은 개발자의 첫 앱입니다:) 여유 시간에 열심히
          공부하면서 만들기 때문에 다소 업데이트가 느릴 수 있는 점 양해
          부탁드립니다!
        </Text>
        <Text style={styles.text}>
          1. [Setting] -> [(기본 설정)카테고리 편집] 에서는 오른쪽 첫 번째
          아이콘을 누르시면 탭 아이콘 변경이 가능합니다.
        </Text>
        <Text style={styles.text}>
          2. [Setting] -> [(기본 설정)카테고리 편집] 에서는 오른쪽 두 번째
          아이콘을 길게 누르시면 위 아래로 순서 변경이 가능합니다.
        </Text>
        <Text style={styles.text}>
          3. [Setting] -> [(기본 설정)탭 디자인 설정] 에서 체크박스를 체크하시면
          상위 다섯 개까지 탭으로 나타납니다.
        </Text>
        <Text style={[styles.text, {color: 'red'}]}>
          4. [Add Phrase] 카메라 기능은 영어 인식만 가능하며 베타 버전입니다.
          안드로이드 버전이 낮은 경우 스마트폰이 꺼질 수도 있습니다 :(
        </Text>
        <Text style={styles.text}>
          5. [View] 에서는 화면의 맨 위쪽 부분을 살짝 위에서 아래로
          쓸어내려주시면 메뉴 화면으로 갈 수 있습니다.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: appStyles.backgroundColor,
  },
  text: {
    //backgroundColor: 'white',
    marginBottom: 14,
    fontSize: 16,
    flexWrap: 'wrap',
  },
});

export default Help;
