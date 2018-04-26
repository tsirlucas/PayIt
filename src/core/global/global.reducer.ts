import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';

import {actions} from './global.actions';

export const initialState = {
  activityIndicator: false,
  backdrop: false,
  backdropCB: null as Function,
};

const activityIndicator = createReducer({}, initialState.activityIndicator)
  .on(actions.showActivityIndicator, () => true)
  .on(actions.hideActivityIndicator, () => false);

const backdrop = createReducer({}, initialState.backdrop)
  .on(actions.showBackdrop, () => true)
  .on(actions.hideBackdrop, () => false);

const backdropCB = createReducer({}, initialState.backdropCB)
  .on(actions.showBackdrop, (_state, payload) => payload.closeCB)
  .on(actions.hideBackdrop, () => null as Function);

export type GlobalState = typeof initialState;
export const globalReducer = combineReducers<GlobalState>({
  activityIndicator,
  backdrop,
  backdropCB,
});
