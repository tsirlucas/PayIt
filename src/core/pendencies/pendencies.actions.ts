import {createAction} from 'redux-act';

import {UserPendencies} from 'src/models';

export const actions = {
  setPendencies: createAction<UserPendencies>('pendencies/SET_PENDENCY'),
  setEmptyPendencies: createAction('pendencies/SET_EMPTY_BILLS'),
  subscribe: createAction<string>('pendencies/SUBSCRIBE_BILLS'),
};
