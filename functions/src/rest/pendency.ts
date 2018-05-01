import {Firestore} from '@google-cloud/firestore';

import {IndexedPendencies, Pendency, User, UserPendencies} from 'models';

export const requestUserPendencies = async (firestore: Firestore, userId: string) => {
  const pendency = await firestore.doc(`/pendencies/${userId}`).get();
  return pendency.data() as UserPendencies;
};

export const requestAllPendencies = async (firestore: Firestore) => {
  const pendenciesDocuments = await firestore.collection('/pendencies').get();

  const pendencies = {} as {[index: string]: UserPendencies};

  pendenciesDocuments.forEach((doc) => {
    const data = doc.data() as UserPendencies;
    pendencies[data.id] = data;
  });

  return pendencies;
};

export const setPendencies = (firestore: Firestore, user: User, pendencies: IndexedPendencies) => {
  return firestore.doc(`/pendencies/${user.uid}`).set({
    id: user.uid,
    data: pendencies,
  });
};

export const setPendency = async (firestore: Firestore, user: User, pendency: Pendency) => {
  const doc = firestore.doc(`/pendencies/${user.uid}`);

  const snapshot = await doc.get();

  if (!snapshot.exists) {
    return setPendencies(firestore, user, {[pendency.id]: pendency});
  }

  const {data} = snapshot.data() as UserPendencies;

  return firestore.doc(`/pendencies/${user.uid}`).set(
    {
      data: {...data, [pendency.id]: pendency},
    },
    {merge: true},
  );
};
