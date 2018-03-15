import {combineReducers} from 'redux';

import {user, UserState} from 'core/user';

export type RootState = {
  user: UserState;
};

export const rootReducer = combineReducers<RootState>({
  user,
});
