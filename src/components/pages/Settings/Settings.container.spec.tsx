import React from 'react';
import renderer from 'react-test-renderer';
import {DeepReadonly} from 'utility-types';

import {actions} from 'core/user';
import {User} from 'models';

import {UnconnectedSettings} from './Settings.container';

function wrap() {
  const props = {
    actions: {
      changeUserName: actions.changeUserName,
    },
    user: {uid: 'random', payday: 10, displayName: 'Username'} as DeepReadonly<User>,
  };

  type propsType = typeof props;

  const wrapper = renderer.create(<UnconnectedSettings {...props as propsType} />);

  return {
    props,
    component: wrapper,
  };
}
describe('BillsForm container', () => {
  it('should render Settings page without crashing', () => {
    const rendered = wrap().component.toJSON();
    expect(rendered).toBeTruthy();
  });
});
