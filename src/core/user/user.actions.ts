import {createAction} from 'redux-act';

import {User} from 'models';

export const actions = {
  signIn: createAction('user/SIGN_IN'),
  signOut: createAction('user/SIGN_OUT'),
  checkAuth: createAction('user/CHECK_AUTH'),
  setUser: createAction<User>('user/SET_USER'),
  setPayday: createAction<{value: number; edit: boolean}>('user/SET_PAYDAY'),
  changeUserName: createAction<string>('user/CHANGE_USER_NAME'),
  pushNotificationSetup: createAction<string>('user/PUSH_NOTIFICATION_SETUP'),
};
