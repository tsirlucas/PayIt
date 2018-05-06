import React from 'react';
import renderer from 'react-test-renderer';
import {DeepReadonly} from 'utility-types';

import {actions as pendenciesActions} from 'core/pendencies';
import {CategorizedPendencies, Pendency} from 'models';

import {UnconnectedHome} from './Home.container';

function wrap(pendencies: CategorizedPendencies) {
  const props = {
    actions: {
      openPendenciesModal: pendenciesActions.openPendenciesModal,
    },
    pendencies: pendencies as DeepReadonly<CategorizedPendencies>,
    userName: 'Username',
  };

  type propsType = typeof props;

  const wrapper = renderer.create(<UnconnectedHome {...props as propsType} />);

  return {
    props,
    component: wrapper,
  };
}

it('should render Home page with no pendencies without crashing', () => {
  const rendered = wrap({
    delayed: [] as Pendency[],
    ideal: [] as Pendency[],
    next: [] as Pendency[],
  }).component.toJSON();
  expect(rendered).toBeTruthy();
});

it('should render Home page loading pendencies without crashing', () => {
  const rendered = wrap(null as CategorizedPendencies).component.toJSON();
  expect(rendered).toBeTruthy();
});

it('should render Home page with pendencies without crashing', () => {
  const pendency = {
    id: 'randomid',
    billId: 'billid',
    expirationDay: 'random',
    description: 'random',
    type: 'random',
    value: 200.57,
    warning: true,
  };
  const rendered = wrap({
    delayed: [pendency] as Pendency[],
    ideal: [pendency] as Pendency[],
    next: [pendency] as Pendency[],
  }).component.toJSON();
  expect(rendered).toBeTruthy();
});
