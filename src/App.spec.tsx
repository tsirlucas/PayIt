import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

jest.mock('react-native-google-signin', () => {});

it('should render App without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
