import {fork, put, takeLatest} from 'redux-saga/effects';

import {FirebaseAuthService} from 'src/services';

import {actions as billsActions} from '../bills/bills.actions';
import {actions as pendenciesActions} from '../pendencies/pendencies.actions';
import {actions as userActions} from '../user/user.actions';
import {actions} from './global.actions';

function* initApplicationSaga() {
  yield put(userActions.checkAuth());
  const userId = yield FirebaseAuthService.getInstance().waitForAuthentication();
  yield put(pendenciesActions.subscribe(userId));
  yield put(billsActions.subscribe([`permissions.${userId}`, '>', '']));
}

function* globalFlow() {
  yield takeLatest(actions.initApplication, initApplicationSaga);
}

export function* globalSaga() {
  yield fork(globalFlow);
}
