import React from 'react';
import {Button} from 'react-native';

interface buttonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const ButtonComponent = ({
  title,
  onPress,
  disabled,
}: buttonProps): JSX.Element => {
  return (
    <Button
      testID="testButton"
      title={title}
      onPress={onPress}
      disabled={disabled || false}
    />
  );
};

export default ButtonComponent;
