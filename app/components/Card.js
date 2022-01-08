import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components';
import constants from '../constants';

const Card = ({contents, prepos, source, textColor = 'black'}) => {
  return (
    <Container>
      <CardView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          //alignItems: 'center',
        }}>
        <Text textColor={textColor}>{contents}</Text>
        {prepos.length > 0 ? (
          <Text textColor={textColor}>
            {prepos} {source}
          </Text>
        ) : (
          <Text textColor={textColor}>{source}</Text>
        )}
      </CardView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  margin: 10px;
  width: ${Math.round(constants.width / 2.0) + 'px'};
`;

const Text = styled.Text`
  color: ${props => (props.textColor ? props.textColor : 'black')};
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  margin-top: 15px;
`;

const CardView = styled.ScrollView``;
export default Card;
