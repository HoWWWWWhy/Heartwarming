import React from 'react';
import styled from 'styled-components';
import constants from '../constants';

const MenuButton = ({text, onPress, bgColor = null, textColor = null}) => {
  return (
    <Container>
      <TouchButton bgColor={bgColor} onPress={onPress}>
        <Text textColor={textColor}>{text}</Text>
      </TouchButton>
    </Container>
  );
};

const Container = styled.View`
  margin: 10px;
  width: ${Math.round(constants.width / 2.0) + 'px'};
`;

const TouchButton = styled.TouchableOpacity`
  background-color: ${props =>
    props.bgColor ? props.bgColor : 'mediumseagreen'};
  border-radius: 5px;
  padding: 10px;
`;

const Text = styled.Text`
  color: ${props => (props.textColor ? props.textColor : 'black')};
  font-weight: bold;
  text-align: center;
  font-size: 15px;
`;

export default MenuButton;
