import {fork} from 'redux-saga/effects';

import {userSaga} from 'core/user';

export function* rootSaga() {
  yield [yield fork(userSaga)];
}
