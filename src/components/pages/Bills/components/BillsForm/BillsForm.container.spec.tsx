import React from 'react';
import {createRenderer} from 'react-test-renderer/shallow';
import {DeepReadonly} from 'utility-types';

import {actions as billsActions} from 'core/bills';
import {Bill} from 'models';
import {mockedBill} from 'tests';

import {UnconnectedBillsForm} from './BillsForm.container';

function wrap(bill?: DeepReadonly<Bill>) {
  const props = {
    actions: {
      saveBill: billsActions.saveBill,
    },
    bill,
  };

  type propsType = typeof props;
  const renderer = createRenderer();
  renderer.render(<UnconnectedBillsForm {...props as propsType} />);

  return {
    props,
    component: renderer,
  };
}

describe('BillsForm container', () => {
  it('should render BillsForm page without bill without crashing', () => {
    const rendered = wrap().component.getRenderOutput();
    expect(rendered).toBeTruthy();
  });

  it('should render BillsForm page with bill without crashing', () => {
    const rendered = wrap(mockedBill).component.getRenderOutput();
    expect(rendered).toBeTruthy();
  });
});
