import React from 'react';
import renderer from 'react-test-renderer';
import {Login} from './Login.container';

jest.mock('react-native-google-signin', () => {});

it('should render Login page without crashing', () => {
  const rendered = renderer.create(<Login />).toJSON();
  expect(rendered).toBeTruthy();
});
