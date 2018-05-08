import {GoogleSignin} from 'react-native-google-signin';
import {getLanguages} from 'react-native-i18n';
import {Actions} from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import {Action} from 'redux-act';
import {eventChannel} from 'redux-saga';
import {call, fork, put, select, take, takeLatest} from 'redux-saga/effects';

import {FirebaseAuthService, UserRestService} from 'services';
import {SentryService} from 'services';
import {RootState} from 'src/core';
import {environment} from 'src/environment';
import {User} from 'src/models';

import {actions as globalActions} from '../global/global.actions';
import {actions} from './user.actions';

function* storeUser(user: User) {
  try {
    const firebaseUser = yield UserRestService.getInstance().getUser(user.uid);

    SentryService.getInstance().setUserContext({
      email: user.email,
      id: user.uid,
      username: user.displayName,
    });

    if (firebaseUser.payday) {
      yield call(Actions.reset, 'application');

      yield put(actions.setUser(firebaseUser));
      yield put(actions.pushNotificationSetup(user.uid));
      yield put(actions.storeI18nSetup());
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

    try {
      const googleAuth = yield GoogleSignin.signIn();
      const idToken = googleAuth.idToken;
      const accessToken = googleAuth.accessToken;

      const firebaseAuth = yield FirebaseAuthService.getInstance().signIn(idToken, accessToken);
      yield storeUser(firebaseAuth._user);
    } catch (e) {
      if (
        (e.name !== 'GoogleSigninError' && e.code !== -5) ||
        (e.name === 'GoogleSigninError' && e.code !== 12501)
      ) {
        SentryService.getInstance().captureException(e);
        throw e;
      }
    }
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* signOutSaga() {
  try {
    yield put(globalActions.showActivityIndicator());
    const userId = yield select((state: RootState) => state.user.data.uid);
    yield UserRestService.getInstance().setRegistrationToken(userId, null);
    yield FirebaseAuthService.getInstance().signOut();
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* pushNotificationSetupSaga(action: Action<string>) {
  try {
    let enabled = yield FirebaseAuthService.getInstance().hasPushPermission();

    if (!enabled) {
      enabled = yield FirebaseAuthService.getInstance().requestPushPermission();
    }

    if (enabled) {
      const fcmToken = yield FirebaseAuthService.getInstance().getRegistrationToken();

      yield UserRestService.getInstance().setRegistrationToken(action.payload, fcmToken);
    }
  } catch (e) {
    throw e;
  }
}

function* setPaydaySaga(action: Action<{value: number; edit: boolean}>) {
  try {
    yield put(globalActions.showActivityIndicator());

    const user = yield select((state: RootState) => state.user.data);
    const newUser = {...user, payday: action.payload.value};

    yield UserRestService.getInstance().setUser(newUser);

    yield put(actions.setUser(newUser));
    if (action.payload.edit) {
      yield call(Actions.pop);
    } else {
      yield call(Actions.reset, 'application');
      yield put(actions.pushNotificationSetup(newUser.uid));
      yield put(actions.storeI18nSetup());
    }
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
      yield call(SplashScreen.hide);
    }
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
    yield call(SplashScreen.hide);
  }
}

function* changeUserNameSaga(action: Action<string>) {
  try {
    yield put(globalActions.showActivityIndicator());

    const user = yield select((state: RootState) => state.user.data);
    const newUser = {...user, displayName: action.payload};

    yield UserRestService.getInstance().setUser(newUser);

    yield put(actions.setUser(newUser));
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* storeI18nSetupSaga() {
  try {
    const locales = yield getLanguages();
    const user = yield select((state: RootState) => state.user.data);
    const newUser = {...user, i18n: locales[0]};

    yield UserRestService.getInstance().setUser(newUser);

    yield put(actions.setUser(newUser));
  } catch (e) {
    throw e;
  }
}

function* userFlow() {
  yield takeLatest(actions.signIn, signInSaga);
  yield takeLatest(actions.signOut, signOutSaga);
  yield takeLatest(actions.checkAuth, checkAuthSaga);
  yield takeLatest(actions.setPayday, setPaydaySaga);
  yield takeLatest(actions.changeUserName, changeUserNameSaga);
  yield takeLatest(actions.pushNotificationSetup, pushNotificationSetupSaga);
  yield takeLatest(actions.storeI18nSetup, storeI18nSetupSaga);
}

export function* userSaga() {
  yield fork(userFlow);
}
