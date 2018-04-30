import {Firestore} from '@google-cloud/firestore';

import {User, UserPendencies} from 'models';

export const requestAllUsers = async (firestore: Firestore) => {
  const usersDocuments = await firestore.collection(`/users`).get();

  const users = {} as {[index: string]: User};

  usersDocuments.forEach((doc) => {
    const data = doc.data() as User;
    users[data.uid] = data;
  });

  return users;
};

export const getUserPendencies = async (firestore: Firestore, userId: string) => {
  const user = await firestore.doc(`/users/${userId}`).get();
  const pendencies = await firestore.doc(`/pendencies/${userId}`).get();

  return {user: user.data() as User, pendencies: pendencies.data() as UserPendencies};
};
