import { RNFirebase } from 'react-native-firebase';
import { FirebaseSingleton } from './FirebaseSingleton';

interface FirebaseEntityPattern {}

export class FirebaseRestService {
  private db: RNFirebase.firestore.Firestore;
  private collection: RNFirebase.firestore.CollectionReference;

  constructor(collection: string) {
    const { Firebase } = FirebaseSingleton.getInstance();
    this.db = Firebase.firestore();
    this.collection = this.db.collection(collection);
  }

  async get(collectionId: string) {
    const docRef = this.collection.doc(collectionId);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async add<T extends FirebaseEntityPattern>(collection: T) {
    const doc = await this.collection.doc();
    await doc.set(Object.assign(collection, { id: doc.id }));
    const addedDoc = await doc.get();
    return { ...addedDoc.data(), id: doc.id };
  }

  async update<T extends FirebaseEntityPattern>(collectionId: string, newData: T) {
    const docRef = this.collection.doc(collectionId);
    await docRef.update(newData);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  delete(collectionId: string) {
    const docRef = this.collection.doc(collectionId);
    return docRef.delete();
  }
}
