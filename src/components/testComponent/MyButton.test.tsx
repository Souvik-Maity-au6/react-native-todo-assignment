// MyButton.test.tsx
import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import ButtonComponent from '../ButtonComponent';

describe('MyButton', () => {
  it('renders correctly with given title', () => {
    const {getByText} = render(
      <ButtonComponent title="Click Me" onPress={() => {}} />,
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <ButtonComponent title="Press Me" onPress={onPressMock} />,
    );

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
