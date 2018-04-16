import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as secureCompare from 'secure-compare';

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

  res.send('Pendencies updates triggered');

  const firestore = admin.firestore();

  const pendenciesPromise = firestore.ref(`/pendencies`).get();

  return pendenciesPromise.then((pendencies) => {
    const updatePromise = pendencies.map((userPendencies) => {
      return updateUserPendencies(firestore, userPendencies);
    });

    return Promise.all(updatePromise);
  });
});

const updateUserPendencies = async (firestore: FirebaseFirestore.Firestore, pendencies) => {
  const user = await firestore.ref(`/users/${pendencies.id}`).get();
  const bills = await firestore.ref(`/bills`).get();

  const {payday} = user;

  const updatedPendencies = Object.keys(pendencies.data).reduce((curr, next) => {
    const bill = bills[pendencies.data[next].billId];
    return {...curr, ...computePendencies(bill, pendencies.data, payday)};
  }, {});

  return firestore.ref(`/pendencies/${user.uid}`).set({
    id: user.uid,
    data: updatedPendencies,
  });
};
