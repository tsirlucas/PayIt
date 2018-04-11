import {eventChannel} from 'redux-saga';
import {fork, put, take, takeLatest} from 'redux-saga/effects';

import {BillsRestService} from 'services';

import {actions as userActions} from '../user/user.actions';
import {actions} from './bills.actions';

function createBillsChannel() {
  return eventChannel((emit) => {
    return BillsRestService.getInstance().subscribe((changes: any) => {
      emit(changes);
    });
  });
}

function* subscribeBillsSaga() {
  try {
    const billsChannel = createBillsChannel();

    while (true) {
      yield takeLatest(userActions.signOut, billsChannel.close);

      const item = yield take(billsChannel);
      switch (item.type) {
        case 'added':
          yield put(actions.setBill(item.data));
          break;
        case 'modified':
          yield put(actions.setBill(item.data));
          break;
        case 'removed':
          yield put(actions.removeBill(item.data));
          break;
        case 'empty':
          yield put(actions.setEmptyBills());
          break;
        default:
      }
    }
  } catch (err) {
    throw err;
  }
}

function* billsFlow() {
  yield takeLatest(actions.subscribe, subscribeBillsSaga);
}

export function* billsSaga() {
  yield fork(billsFlow);
}
