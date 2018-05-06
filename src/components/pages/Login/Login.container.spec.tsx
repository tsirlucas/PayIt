import React from 'react';
import renderer from 'react-test-renderer';
import {actions as userActions} from 'core/user';

import {UnconnectedLogin} from './Login.container';

function wrap() {
  const props = {
    actions: {
      signIn: userActions.signIn,
    },
  };

  const wrapper = renderer.create(<UnconnectedLogin {...props} />);

  return {
    props,
    component: wrapper,
  };
}
describe('Login container', () => {
  it('should render Login page without crashing', () => {
    const rendered = wrap().component.toJSON();
    expect(rendered).toBeTruthy();
  });
});
