import Firebase from 'react-native-firebase';
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

  private constructor() {
    this.firebaseService = FirebaseSingleton.getInstance().Firebase;
  }
}
