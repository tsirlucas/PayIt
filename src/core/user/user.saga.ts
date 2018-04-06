import {GoogleSignin} from 'react-native-google-signin';
import {Actions} from 'react-native-router-flux';
import {call, fork, put, takeLatest} from 'redux-saga/effects';

import {FirebaseAuthService, UserRestService} from 'services';
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

    const parsedUser = {
      uid: firebaseAuth.uid,
      displayName: googleAuth.givenName,
      email: googleAuth.email,
      fullName: googleAuth.name,
      photo: googleAuth.photo,
    };

    yield UserRestService.getInstance().setUser(parsedUser);
    yield put(actions.setUser(parsedUser));
    yield call(Actions.reset, 'application');
  } catch (e) {
    throw e;
  } finally {
    yield put(globalActions.hideActivityIndicator());
  }
}

function* userFlow() {
  yield takeLatest(actions.signIn, signInSaga);
}

export function* userSaga() {
  yield fork(userFlow);
}
