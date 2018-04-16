import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {computePendencies} from './computePendencies';

export const onBillChange = functions.firestore.document('bills/{billId}').onWrite((event) => {
  const newBillValue = event.after.data();
  const users = Object.keys(newBillValue.permissions);

  const firestore = admin.firestore();

  const requestedDataByUser = users.map((userId) => {
    const userPromise = firestore.doc(`/users/${userId}`).get();
    const pendenciesPromise = firestore.doc(`/pendencies/${userId}`).get();

    return Promise.all([userPromise, pendenciesPromise]);
  });

  const changes = Promise.all(requestedDataByUser).then((results) => {
    const [user, pendencies] = results[0];
    return updateUserPendencies(firestore, user.data(), pendencies.data() as any, newBillValue);
  });

  return changes;
});

const updateUserPendencies = (
  firestore: FirebaseFirestore.Firestore,
  user,
  pendencies = {data: null},
  bill,
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
