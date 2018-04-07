import {GoogleSignin} from 'react-native-google-signin';
import {Actions} from 'react-native-router-flux';
import {Action} from 'redux-act';
import {call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {FirebaseAuthService, UserRestService} from 'services';
import {RootState} from 'src/core';
import {environment} from 'src/environment';

import {actions as globalActions} from '../global/global.actions';
import {actions} from './user.actions';

function* signInSaga() {
  try {
    yield put(globalActions.showActivityIndicator());
    yield GoogleSignin.hasPlayServices({autoResolve: true});

    yield GoogleSignin.configure({
      iosClientId: environment.settings.googleAuth.iosClientId,
      webClientId: environment.settings.googleAuth.webClientId,
    });

    const googleAuth = yield GoogleSignin.signIn();

    const idToken = googleAuth.idToken;

    const accessToken = googleAuth.accessToken;
    const firebaseAuth = yield FirebaseAuthService.getInstance().signIn(idToken, accessToken);
    const firebaseUser = yield UserRestService.getInstance().getUser(firebaseAuth.uid);

    if (firebaseUser.payday) {
      yield call(Actions.reset, 'application');
      yield put(actions.setUser(firebaseUser));
    } else {
      const parsedUser = {
        uid: firebaseAuth.uid,
        displayName: googleAuth.givenName,
        email: googleAuth.email,
        fullName: googleAuth.name,
        photo: googleAuth.photo,
      };

      yield UserRestService.getInstance().setUser(parsedUser);
      yield put(actions.setUser(parsedUser));

      yield call(Actions.replace, 'payday-form');
    }
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* setPaydaySaga(action: Action<number>) {
  try {
    yield put(globalActions.showActivityIndicator());

    const user = yield select((state: RootState) => state.user.data);
    const newUser = {...user, payday: action.payload};

    yield UserRestService.getInstance().setUser(newUser);

    yield put(actions.setUser(newUser));
    yield call(Actions.reset, 'application');
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* userFlow() {
  yield takeLatest(actions.signIn, signInSaga);
  yield takeLatest(actions.setPayday, setPaydaySaga);
}

export function* userSaga() {
  yield fork(userFlow);
}
