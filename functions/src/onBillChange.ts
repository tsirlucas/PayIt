import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {computePendencies} from './computePendencies';

export const onBillChange = functions.firestore.document('bills/{billId}').onWrite((event) => {
  const newBillValue = event.data.data();
  const users = Object.keys(newBillValue.permissions);

  const firestore = admin.firestore();

  const requestedDataByUser = users.map((userId) => {
    const userPromise = firestore.ref(`/users/${userId}`).get();
    const pendenciesPromise = firestore.ref(`/pendencies/${userId}`).get();

    return Promise.all([userPromise, pendenciesPromise]);
  });

  const changes = Promise.all(requestedDataByUser).then((results) => {
    const [user, pendencies] = results;
    return updateUserPendencies(firestore, user, pendencies, newBillValue);
  });

  return changes;
});

const updateUserPendencies = (firestore: FirebaseFirestore.Firestore, user, pendencies, bill) => {
  const {payday} = user;

  const updatedPendencies = computePendencies(bill, pendencies.data, payday);

  return firestore.ref(`/pendencies/${user.uid}`).set(
    {
      id: user.uid,
      data: {...pendencies, ...updatedPendencies},
    },
    {merge: true},
  );
};
