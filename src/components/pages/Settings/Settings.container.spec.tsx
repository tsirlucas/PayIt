import React from 'react';
import renderer from 'react-test-renderer';
import {actions} from 'core/user';
import {User} from 'models';

import {UnconnectedSettings} from './Settings.container';

function wrap() {
  const props = {
    actions: {
      changeUserName: actions.changeUserName,
    },
    user: {uid: 'random', payday: 10, displayName: 'Username'} as User,
  };

  const enzymeWrapper = renderer.create(<UnconnectedSettings {...props} />);

  return {
    props,
    component: enzymeWrapper,
  };
}

it('should render Settings page without crashing', () => {
  const rendered = wrap().component.toJSON();
  expect(rendered).toBeTruthy();
});
