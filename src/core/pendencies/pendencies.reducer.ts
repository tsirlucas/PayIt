import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {CategorizedPendencies, IndexedPendencies, UserPendencies} from 'models';

import {actions} from './pendencies.actions';

export const initialState = {
  data: null as IndexedPendencies,
};

export type PendenciesState = typeof initialState;

const data = createReducer({}, initialState.data)
  .on(actions.setPendencies, (_state: IndexedPendencies, payload: UserPendencies) => {
    const initialValue = {
      delayed: [],
      ideal: [],
      next: [],
    } as CategorizedPendencies;

    return Object.values(payload.data).reduce((curr, next) => {
      if (next.type === 'DELAYED') curr.delayed.push(next);
      if (next.type === 'IDEAL') curr.ideal.push(next);
      if (next.type === 'NEXT') curr.next.push(next);
      return curr;
    }, initialValue);
  })
  .on(actions.setEmptyPendencies, () => ({} as IndexedPendencies));

export const pendencies = combineReducers<PendenciesState>({
  data,
});
