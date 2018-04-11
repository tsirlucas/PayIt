import {fork} from 'redux-saga/effects';

import {billsSaga} from 'core/bills';
import {globalSaga} from 'core/global';
import {userSaga} from 'core/user';

export function* rootSaga() {
  yield [yield fork(globalSaga), yield fork(userSaga), yield fork(billsSaga)];
}
