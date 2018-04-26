import React from 'react';
import renderer from 'react-test-renderer';
import {actions as pendenciesActions} from 'core/pendencies';
import {CategorizedPendencies, Pendency} from 'models';

import {UnconnectedHome} from './Home.container';

function wrap(pendencies: CategorizedPendencies) {
  const props = {
    actions: {
      openPendenciesModal: pendenciesActions.openPendenciesModal,
    },
    pendencies: pendencies,
    userName: 'Username',
  };

  const enzymeWrapper = renderer.create(<UnconnectedHome {...props} />);

  return {
    props,
    component: enzymeWrapper,
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
