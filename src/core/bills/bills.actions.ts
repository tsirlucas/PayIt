import {createAction} from 'redux-act';

import {Bill} from 'models';

export const actions = {
  setBill: createAction<Bill>('bills/SET_BILL'),
  setBills: createAction<Bill[]>('bills/SET_BILLS'),
  setEmptyBills: createAction('bills/SET_EMPTY_BILLS'),
  removeBill: createAction<Bill>('bills/REMOVE_BILL'),
  subscribe: createAction<string[]>('bills/SUBSCRIBE_BILLS'),
  editBill: createAction<string>('bills/EDIT_BILL'),
  newBill: createAction<string>('bills/NEW_BILL'),
  saveBill: createAction<Bill>('bills/SAVE_BILL'),
};
