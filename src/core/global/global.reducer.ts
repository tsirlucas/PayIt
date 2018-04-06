import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {actions} from './global.actions';

export const initialState = {
  activityIndicator: false,
};

const activityIndicator = createReducer({}, initialState.activityIndicator)
  .on(actions.showActivityIndicator, () => true)
  .on(actions.hideActivityIndicator, () => false);

export type GlobalState = typeof initialState;
export const global = combineReducers<GlobalState>({
  activityIndicator,
});
