import {combineReducers, Reducer} from 'redux';
import {DeepReadonly} from 'utility-types';

import {bills} from 'core/bills';
import {globalReducer} from 'core/global';
import {pendencies} from 'core/pendencies';
import {user} from 'core/user';

const rootReducerObj = {
  global: globalReducer,
  user,
  bills,
  pendencies,
};

type RootType = typeof rootReducerObj;
type UnboxReducer<T> = T extends Reducer<infer U> ? U : T;

// State should be readonly
export type RootState = DeepReadonly<{[P in keyof RootType]: UnboxReducer<RootType[P]>}>;

export const rootReducer = combineReducers<RootState>(rootReducerObj);
