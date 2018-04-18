import {Action} from 'redux-act';
import {eventChannel} from 'redux-saga';
import {fork, put, take, takeLatest} from 'redux-saga/effects';

import {PendenciesRestService} from 'services';

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

function* pendenciesFlow() {
  yield takeLatest(actions.subscribe, subscribePendenciesSaga);
}

export function* pendenciesSaga() {
  yield fork(pendenciesFlow);
}
