import {Actions} from 'react-native-router-flux';
import {Action} from 'redux-act';
import {eventChannel} from 'redux-saga';
import {call, fork, put, select, take, takeLatest} from 'redux-saga/effects';

import {PendenciesRestService} from 'services';
import {RootState} from 'src/core/rootReducer';

import {actions as globalActions} from '../global/global.actions';
import {actions as userActions} from '../user/user.actions';
import {actions} from './pendencies.actions';

function createPendenciesChannel(id: string) {
  return eventChannel((emit) => {
    return PendenciesRestService.getInstance().subscribeDocument(id, (changes: any) => {
      emit(changes);
    });
  });
}

function* subscribePendenciesSaga(action: Action<string>) {
  try {
    const pendenciesChannel = createPendenciesChannel(action.payload);

    while (true) {
      yield takeLatest(userActions.signOut, pendenciesChannel.close);

      const item = yield take(pendenciesChannel);
      switch (item.type) {
        case 'modified':
          yield put(actions.setPendencies(item.data));
          break;
        case 'empty':
          yield put(actions.setEmptyPendencies());
          break;
        default:
      }
    }
  } catch (err) {
    throw err;
  }
}

function* openPendenciesModalSaga(action: Action<string>) {
  try {
    yield call(Actions.push, 'pendencies-modal', {type: action.payload});
  } catch (err) {
    throw err;
  }
}

function* payPendencySaga(action: Action<string>) {
  try {
    yield put(globalActions.showActivityIndicator());
    const id = yield select((state: RootState) => state.user.data.uid);
    yield PendenciesRestService.getInstance().setPendencyAsPaid(id, action.payload);
  } catch (err) {
    throw err;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* pendenciesFlow() {
  yield takeLatest(actions.subscribe, subscribePendenciesSaga);
  yield takeLatest(actions.openPendenciesModal, openPendenciesModalSaga);
  yield takeLatest(actions.payPendency, payPendencySaga);
}

export function* pendenciesSaga() {
  yield fork(pendenciesFlow);
}
