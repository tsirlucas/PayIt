import React from 'react';
import renderer from 'react-test-renderer';

import { Bills } from './Bills';

it('should render Bills page without crashing', () => {
  const rendered = renderer.create(<Bills />).toJSON();
  expect(rendered).toBeTruthy();
});
