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

  subscribeDocument = (id: string, cb: Function) => {
    return this.collection.doc(id).onSnapshot(
      (change) => {
        console.log(change);
        if (!change.exists) cb({type: 'empty'});
        return cb({type: 'modified', data: change.data()});
      },
      (err) => {
        throw err;
      },
    );
  };

  subscribeCollection = (cb: Function, filter: [string, string, string]) => {
    return this.collection.where(filter[0], filter[1] as any, filter[2]).onSnapshot(
      (changes) => {
        if (changes.docChanges.length === 0) cb({type: 'empty'});
        changes.docChanges.map((change) => {
          return cb({type: change.type, data: change.doc.data()});
        });
      },
      (err) => {
        throw err;
      },
    );
  };
}
