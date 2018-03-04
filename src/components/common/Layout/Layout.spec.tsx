import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { SceneProps } from 'react-native-router-flux';

import { NavbarComponent, TabBarComponent } from './Layout';

it('should render Navbar without crashing', () => {
  const props = {
    title: 'Title',
  } as SceneProps;

  const rendered = renderer.create(<NavbarComponent {...props} />).toJSON();
  expect(rendered).toBeTruthy();
});

it('should render Tabbar without crashing', () => {
  const Bar = () => <Text>Bar</Text>;
  const props = {
    key: 'key',
    component: Bar,
    navigationState: {
      routes: [
        { key: 'Tab1' },
        { key: 'Tab2' },
        { key: 'Tab3' },
      ],
    },
  } as SceneProps;
  const rendered = renderer.create(<NavbarComponent {...props} />).toJSON();
  expect(rendered).toBeTruthy();
});
