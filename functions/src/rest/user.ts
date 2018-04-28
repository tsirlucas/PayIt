import {Firestore} from '@google-cloud/firestore';

import {User} from 'models';

export const requestAllUsers = async (firestore: Firestore) => {
  const usersDocuments = await firestore.collection(`/users`).get();

  const users = {} as {[index: string]: User};

  usersDocuments.forEach((doc) => {
    const data = doc.data() as User;
    users[data.uid] = data;
  });

  return users;
};
