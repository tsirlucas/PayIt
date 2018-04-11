import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {IndexedBills} from 'models';

import {actions} from './bills.actions';

export const initialState = {
  data: null as IndexedBills,
};

export type BillsState = typeof initialState;

const data = createReducer({}, initialState.data)
  .on(actions.setBills, (_state, payload) =>
    payload.reduce(
      (curr, next) => {
        curr[next.id] = next;
        return curr;
      },
      {} as IndexedBills,
    ),
  )
  .on(actions.setBill, (state: IndexedBills, payload) => ({...state, [payload.id]: payload}))
  .on(actions.removeBill, (state: IndexedBills, payload) =>
    Object.values(state)
      .filter((item) => item.id !== payload.id)
      .reduce(
        (curr, next) => {
          curr[next.id] = next;
          return curr;
        },
        {} as IndexedBills,
      ),
  )
  .on(actions.setEmptyBills, () => ({} as IndexedBills));

export const bills = combineReducers<BillsState>({
  data,
});
