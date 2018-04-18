import {createAction} from 'redux-act';

import {User} from 'models';

export const actions = {
  signIn: createAction('user/SIGN_IN'),
  signOut: createAction('user/SIGN_OUT'),
  checkAuth: createAction('user/CHECK_AUTH'),
  setUser: createAction<User>('user/SET_USER'),
  setPayday: createAction<number>('user/SET_PAYDAY'),
  pushNotificationSetup: createAction<string>('user/PUSH_NOTIFICATION_SETUP'),
};
