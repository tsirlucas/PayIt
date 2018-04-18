import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Bill, IndexedPendencies, User, UserPendencies} from 'models';

import {computePendencies} from './computePendencies';

export const onBillChange = functions.firestore.document('bills/{billId}').onWrite((event) => {
  const newBillValue: Bill = event.after.data() as Bill;
  const users = Object.keys(newBillValue.permissions);

  const firestore = admin.firestore();

  const requestedDataByUser = users.map((userId) => {
    const userPromise = firestore.doc(`/users/${userId}`).get();
    const pendenciesPromise = firestore.doc(`/pendencies/${userId}`).get();

    return Promise.all([userPromise, pendenciesPromise]);
  });

  const changes = Promise.all(requestedDataByUser).then((results) => {
    const [user, pendencies] = results[0];
    return updateUserPendencies(
      firestore,
      user.data() as User,
      pendencies.data() as UserPendencies,
      newBillValue as Bill,
    );
  });

  return changes;
});

const updateUserPendencies = (
  firestore: FirebaseFirestore.Firestore,
  user: User,
  pendencies: UserPendencies = {id: null as string, data: null as IndexedPendencies},
  bill: Bill,
) => {
  const {payday} = user;
  const data = pendencies.data || {};
  const updatedPendencies = computePendencies(bill, data, payday);

  return firestore.doc(`/pendencies/${user.uid}`).set(
    {
      id: user.uid,
      data: {...data, ...updatedPendencies},
    },
    {merge: true},
  );
};
