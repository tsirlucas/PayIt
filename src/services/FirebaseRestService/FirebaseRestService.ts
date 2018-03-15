import {RNFirebase} from 'react-native-firebase';
import {FirebaseSingleton} from './FirebaseSingleton';

interface FirebaseEntityPattern {}

export class FirebaseRestService {
  private db: RNFirebase.firestore.Firestore;
  private collection: RNFirebase.firestore.CollectionReference;

  constructor(collection: string) {
    const {Firebase} = FirebaseSingleton.getInstance();
    this.db = Firebase.firestore();
    this.collection = this.db.collection(collection);
  }

  async get(collectionId: string) {
    const docRef = this.collection.doc(collectionId);
    const doc = await docRef.get();
    return {id: doc.id, ...doc.data()};
  }

  async set<T extends FirebaseEntityPattern>(collectionId: string, newData: T) {
    const docRef = this.collection.doc(collectionId);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set(newData);
    } else {
      await docRef.update(newData);
    }
  }

  delete(collectionId: string) {
    const docRef = this.collection.doc(collectionId);
    return docRef.delete();
  }
}
