import React from 'react';
import renderer from 'react-test-renderer';
import {Home} from './Home';

it('should render Home page without crashing', () => {
  const rendered = renderer.create(<Home />).toJSON();
  expect(rendered).toBeTruthy();
});
