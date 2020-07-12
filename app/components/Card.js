import React, {useEffect} from 'react';
import styled from 'styled-components';
import constants from '../constants';

const Card = ({contents, prepos, source}) => {
  return (
    <Container>
      <Text>{contents}</Text>

      {prepos.length > 0 ? (
        <Text>
          {prepos} {source}
        </Text>
      ) : (
        <Text>{source}</Text>
      )}
    </Container>
  );
};

const Container = styled.View`
  margin: 10px;
  width: ${Math.round(constants.width / 2.0) + 'px'};
`;

const Text = styled.Text`
  color: black;
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  margin-top: 15px;
`;

export default Card;
