import {createAction} from 'redux-act';

import {User} from 'models';

export const actions = {
  signIn: createAction('user/SIGN_IN'),
  setUser: createAction<User>('user/SET_USER'),
  setPayday: createAction<number>('user/SET_PAYDAY'),
};
