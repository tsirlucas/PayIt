import {Actions} from 'react-native-router-flux';
import {Action} from 'redux-act';
import {eventChannel} from 'redux-saga';
import {fork, put, take, takeLatest} from 'redux-saga/effects';

import {BillsRestService} from 'services';
import {Bill} from 'src/models';

import {actions as globalActions} from '../global';
import {actions as userActions} from '../user/user.actions';
import {actions} from './bills.actions';

function createBillsChannel(filter: [string, string, string]) {
  return eventChannel((emit) => {
    return BillsRestService.getInstance().subscribe((changes: any) => {
      emit(changes);
    }, filter);
  });
}

function* subscribeBillsSaga(action: Action<[string, string, string]>) {
  try {
    const billsChannel = createBillsChannel(action.payload);

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

function* triggerBillFormSaga(action: Action<string>) {
  try {
    if (action.payload) yield Actions.push('bills-form', {formType: 'editBill'});
    else yield Actions.push('bills-form', {formType: 'newBill'});
  } catch (err) {
    throw err;
  }
}

function* saveBillSaga(action: Action<Bill>) {
  try {
    yield put(globalActions.showActivityIndicator());
    yield BillsRestService.getInstance().setBill(action.payload);
    yield Actions.pop();
  } catch (err) {
    throw err;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* deleteBillSaga(action: Action<string>) {
  try {
    yield put(globalActions.showActivityIndicator());
    yield BillsRestService.getInstance().remove(action.payload);
  } catch (err) {
    throw err;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* billsFlow() {
  yield takeLatest(actions.subscribe, subscribeBillsSaga);
  yield takeLatest(actions.editBill, triggerBillFormSaga);
  yield takeLatest(actions.newBill, triggerBillFormSaga);
  yield takeLatest(actions.saveBill, saveBillSaga);
  yield takeLatest(actions.deleteBill, deleteBillSaga);
}

export function* billsSaga() {
  yield fork(billsFlow);
}
