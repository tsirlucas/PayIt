import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {CategorizedPendencies, UserPendencies} from 'models';

import {actions} from './pendencies.actions';

export const initialState = {
  data: null as CategorizedPendencies,
};

export type PendenciesState = typeof initialState;

const data = createReducer({}, initialState.data)
  .on(actions.setPendencies, (_state, payload: UserPendencies = {} as UserPendencies) => {
    const initialValue = {
      delayed: [],
      ideal: [],
      next: [],
    } as CategorizedPendencies;

    if (!payload.data) return initialValue;

    return (
      Object.values(payload.data).reduce((curr, next) => {
        if (next.type === 'DELAYED') curr.delayed.push(next);
        if (next.type === 'IDEAL') curr.ideal.push(next);
        if (next.type === 'NEXT') curr.next.push(next);
        return curr;
      }, initialValue) || initialValue
    );
  })
  .on(
    actions.setEmptyPendencies,
    () =>
      ({
        delayed: [],
        ideal: [],
        next: [],
      } as CategorizedPendencies),
  );

export const pendencies = combineReducers<PendenciesState>({
  data,
});
