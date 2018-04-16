import {GoogleSignin} from 'react-native-google-signin';
import {Actions} from 'react-native-router-flux';
import {Action} from 'redux-act';
import {eventChannel} from 'redux-saga';
import {call, fork, put, select, take, takeLatest} from 'redux-saga/effects';

import {FirebaseAuthService, UserRestService} from 'services';
import {RootState} from 'src/core';
import {environment} from 'src/environment';
import {User} from 'src/models';

import {actions as globalActions} from '../global/global.actions';
import {actions} from './user.actions';

function* storeUser(user: User) {
  try {
    const firebaseUser = yield UserRestService.getInstance().getUser(user.uid);
    if (firebaseUser.payday) {
      yield call(Actions.reset, 'application');

      yield put(actions.setUser(firebaseUser));
      yield put(actions.pushNotificationSetup(user.uid));
    } else {
      const parsedUser = {
        uid: user.uid,
        displayName: user.displayName.split(' ')[0],
        email: user.email,
        fullName: user.displayName,
        photoURL: user.photoURL,
      };

      yield UserRestService.getInstance().setUser(parsedUser);
      yield put(actions.setUser(parsedUser));

      yield call(Actions.replace, 'payday-form');
    }
  } catch (e) {
    throw e;
  }
}

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
    yield storeUser(firebaseAuth._user);
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* pushNotificationSetupSaga(action: Action<string>) {
  try {
    const enabled = yield FirebaseAuthService.getInstance().hasPushPermission();

    if (enabled) {
      try {
        yield FirebaseAuthService.getInstance().requestPushPermission();
        const fcmToken = yield FirebaseAuthService.getInstance().getRegistrationToken();
        if (fcmToken) {
          yield UserRestService.getInstance().setRegistrationToken(action.payload, fcmToken);
        }
      } catch (error) {
        // User has rejected permissions
      }
    }
  } catch (e) {
    throw e;
  }
}

function* setPaydaySaga(action: Action<number>) {
  try {
    yield put(globalActions.showActivityIndicator());

    const user = yield select((state: RootState) => state.user.data);
    const newUser = {...user, payday: action.payload} as User;

    yield UserRestService.getInstance().setUser(newUser);

    yield put(actions.setUser(newUser));
    yield call(Actions.reset, 'application');
    yield put(actions.pushNotificationSetup(newUser.uid));
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function createAuthChannel() {
  return eventChannel((emit) => FirebaseAuthService.getInstance().watchAuth(emit));
}

function* checkAuthSaga() {
  try {
    yield put(globalActions.showActivityIndicator());

    const authChannel = createAuthChannel();
    while (true) {
      const change = yield take(authChannel);

      if (change.uid) {
        yield storeUser(change._user);
      } else {
        yield call(Actions.reset, 'authentication');
      }
      yield put(globalActions.hideActivityIndicator());
    }
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* userFlow() {
  yield takeLatest(actions.signIn, signInSaga);
  yield takeLatest(actions.checkAuth, checkAuthSaga);
  yield takeLatest(actions.setPayday, setPaydaySaga);
  yield takeLatest(actions.pushNotificationSetup, pushNotificationSetupSaga);
}

export function* userSaga() {
  yield fork(userFlow);
}
