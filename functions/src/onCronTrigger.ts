import {WriteResult} from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as secureCompare from 'secure-compare';

import {Bill, IndexedBills, UserPendencies} from 'models';

import {computePendencies} from './computePendencies';

export const onCronTrigger = functions.https.onRequest((req, res) => {
  const key = req.query.key;

  // Exit if the keys don't match.
  if (!secureCompare(key, functions.config().cron.key)) {
    res
      .status(403)
      .send(
        'Security key does not match. Make sure your "key" URL query parameter matches the ' +
          'cron.key environment variable.',
      );

    return null;
  }

  const firestore = admin.firestore();

  const documentsPromise = firestore.collection('/pendencies').get();

  res.send('Pendencies updates triggered');

  return documentsPromise.then((documents) => {
    const promises: Promise<WriteResult>[] = [];
    documents.forEach((doc) => {
      promises.push(updateUserPendencies(firestore, doc.data() as UserPendencies));
    });
    return Promise.all(promises);
  });
});

const updateUserPendencies = async (
  firestore: FirebaseFirestore.Firestore,
  pendencies: UserPendencies,
) => {
  const userSnapshot = await firestore.doc(`/users/${pendencies.id}`).get();
  const user = userSnapshot.data();
  const billsCollection = await firestore.collection('/bills').get();
  const bills = {} as IndexedBills;

  billsCollection.forEach((doc) => {
    const bill = doc.data() as Bill;
    bills[bill.id] = bill;
  });
  const data = pendencies.data || {};

  const {payday} = user;

  const updatedPendencies = Object.keys(data).reduce((curr, next) => {
    const bill = bills[data[next].billId];
    return {...curr, ...computePendencies(bill, data, payday)};
  }, {});

  return firestore.doc(`/pendencies/${user.uid}`).set({
    id: user.uid,
    data: {...data, ...updatedPendencies},
  });
};
