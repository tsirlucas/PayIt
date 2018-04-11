import {combineReducers} from 'redux';

import {bills, BillsState} from 'core/bills';
import {global, GlobalState} from 'core/global';
import {user, UserState} from 'core/user';

export type RootState = {
  global: GlobalState;
  user: UserState;
  bills: BillsState;
};

export const rootReducer = combineReducers<RootState>({
  global,
  user,
  bills,
});
