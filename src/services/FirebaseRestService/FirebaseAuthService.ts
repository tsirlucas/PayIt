import Firebase from 'react-native-firebase';
import {User} from 'src/models';

import {FirebaseSingleton} from './FirebaseSingleton';

export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private firebaseService: typeof Firebase;

  static getInstance() {
    if (!this.instance) {
      this.instance = new FirebaseAuthService();
    }

    return this.instance;
  }

  async signIn(idToken: string, accessToken: string) {
    const provider = this.firebaseService.auth.GoogleAuthProvider.credential(idToken, accessToken);

    await this.firebaseService.auth().signInAndRetrieveDataWithCredential(provider);
    return this.firebaseService.auth().currentUser;
  }

  watchAuth(cb: Function) {
    return this.firebaseService.auth().onAuthStateChanged((user: User) => cb(user || {}));
  }

  signOut() {
    return this.firebaseService.auth().signOut();
  }

  hasPushPermission() {
    return this.firebaseService.messaging().hasPermission();
  }

  async requestPushPermission() {
    try {
      const result = await this.firebaseService.messaging().requestPermission();
      return result;
    } catch (e) {
      return false;
    }
  }

  getRegistrationToken() {
    return this.firebaseService.messaging().getToken();
  }

  getUserId() {
    const {currentUser} = this.firebaseService.auth();
    return currentUser.uid;
  }

  waitForAuthentication() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const {currentUser} = this.firebaseService.auth();
        if (currentUser) {
          resolve(currentUser.uid);
          clearInterval(interval);
        }
      }, 300);
    });
  }

  private constructor() {
    this.firebaseService = FirebaseSingleton.getInstance().Firebase;
  }
}
