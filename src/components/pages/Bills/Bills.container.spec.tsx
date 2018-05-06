import React from 'react';
import renderer from 'react-test-renderer';
import {actions} from 'core/bills';
import {IndexedBills} from 'models';

import {UnconnectedBills} from './Bills.container';

function wrap() {
  const bill = {
    id: 'random',
    description: 'random',
    generationDay: 10,
    expirationDay: 20,
    frequency: 'random',
    permissions: {random: 'AUTHOR'},
    type: 'random',
    value: 200.85,
  };

  const bills: IndexedBills = {};
  bills.random = bill;
  bills.random2 = bill;

  const props = {
    actions: {
      editBill: actions.editBill,
      createBill: actions.newBill,
      deleteBill: actions.deleteBill,
    },
    bills,
  };

  const wrapper = renderer.create(<UnconnectedBills {...props} />);

  return {
    props,
    component: wrapper,
  };
}
describe('Bills container', () => {
  it('should render Bills page without crashing', () => {
    const rendered = wrap().component.toJSON();
    expect(rendered).toBeTruthy();
  });
});
