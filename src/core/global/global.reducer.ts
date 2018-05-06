import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {actions} from './global.actions';

export const initialState = {
  activityIndicator: false,
  backdrop: false,
};

const activityIndicator = createReducer({}, initialState.activityIndicator)
  .on(actions.showActivityIndicator, () => true)
  .on(actions.hideActivityIndicator, () => false);

const backdrop = createReducer({}, initialState.backdrop)
  .on(actions.showBackdrop, () => true)
  .on(actions.hideBackdrop, () => false);

export type GlobalState = typeof initialState;
export const globalReducer = combineReducers<GlobalState>({
  activityIndicator,
  backdrop,
});
