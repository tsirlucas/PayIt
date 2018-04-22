import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Bill, IndexedPendencies, User, UserPendencies} from 'models';

import {computePendencies} from './computePendencies';

export const onPaydayChange = functions.firestore.document('users/{userId}').onWrite((event) => {
  const oldUserValue: User = event.before.data() as User;
  const newUserValue: User = event.after.data() as User;

  if (oldUserValue.payday && oldUserValue.payday !== newUserValue.payday) {
    const firestore = admin.firestore();

    const pendenciesPromise = firestore.doc(`/pendencies/${newUserValue.uid}`).get();

    const changes = Promise.resolve(pendenciesPromise).then((result) => {
      return updateUserPendencies(firestore, newUserValue, result.data() as UserPendencies);
    });

    return changes;
  } else {
    return true;
  }
});

async function updateUserPendencies(
  firestore: FirebaseFirestore.Firestore,
  user: User,
  pendencies: UserPendencies = {id: null as string, data: null as IndexedPendencies},
) {
  const billsPromise = Object.keys(pendencies.data)
    .filter((key) => pendencies.data[key].type !== 'PAID')
    .map((key) => {
      return firestore.doc(`/bills/${pendencies.data[key].billId}`).get();
    });
  const bills = await Promise.all(billsPromise);

  const changes = bills.map(async (bill) => {
    const {payday} = user;
    const data = pendencies.data || {};
    const updatedPendencies = computePendencies(bill.data() as Bill, data, payday);

    return await firestore.doc(`/pendencies/${user.uid}`).set(
      {
        id: user.uid,
        data: {...data, ...updatedPendencies},
      },
      {merge: true},
    );
  });

  return Promise.all(changes);
}
