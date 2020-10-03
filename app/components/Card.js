import React from 'react';
import styled from 'styled-components';
import constants from '../constants';

const Card = ({contents, prepos, source, textColor = 'black'}) => {
  return (
    <Container>
      <Text textColor={textColor}>{contents}</Text>

      {prepos.length > 0 ? (
        <Text textColor={textColor}>
          {prepos} {source}
        </Text>
      ) : (
        <Text textColor={textColor}>{source}</Text>
      )}
    </Container>
  );
};

const Container = styled.View`
  margin: 10px;
  width: ${Math.round(constants.width / 2.0) + 'px'};
`;

const Text = styled.Text`
  color: ${(props) => (props.textColor ? props.textColor : 'black')};
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  margin-top: 15px;
`;

export default Card;
