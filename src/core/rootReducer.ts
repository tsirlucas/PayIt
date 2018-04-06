import {combineReducers} from 'redux';

import {global, GlobalState} from 'core/global';
import {user, UserState} from 'core/user';

export type RootState = {
  global: GlobalState;
  user: UserState;
};

export const rootReducer = combineReducers<RootState>({
  global,
  user,
});
