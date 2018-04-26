import Firebase from 'react-native-firebase';

export class FirebaseSingleton {
  private static instance: FirebaseSingleton;
  public Firebase: typeof Firebase = Firebase;

  static getInstance() {
    if (!this.instance) {
      this.instance = new FirebaseSingleton();
    }

    return this.instance;
  }

  private constructor() {
    this.Firebase = Firebase;
  }
}
