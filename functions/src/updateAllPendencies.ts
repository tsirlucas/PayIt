import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import secureCompare from 'secure-compare';

import {IndexedBills, IndexedPendencies, User, UserPendencies} from 'models';

import {computeBillPendency} from './core/pendency';
import {requestAllBills} from './rest/bill';
import {requestAllPendencies, setPendencies} from './rest/pendency';
import {requestAllUsers} from './rest/user';

const cronKeyErrorMessage =
  'Security key does not match. Make sure your "key" URL query parameter matches the ' +
  'cron.key environment variable.';

const updatePendencies = (
  firestore: FirebaseFirestore.Firestore,
  pendencies: UserPendencies,
  user: User,
  bills: IndexedBills,
) => {
  const data = pendencies.data || {};

  const {payday} = user;

  const updatedPendencies = Object.keys(data).reduce(
    (curr, next) => {
      const bill = bills[data[next].billId];
      const updatedPendency = computeBillPendency(bill, data, payday);
      return {...curr, [updatedPendency.id]: updatedPendency};
    },
    {} as IndexedPendencies,
  );

  return setPendencies(firestore, user, updatedPendencies);
};

export const updateAllPendencies = functions.https.onRequest(async (req, res) => {
  const queryKey = req.query.key;

  // Exit if the keys don't match.
  if (!secureCompare(queryKey, functions.config().cron.key)) {
    res.status(403).send(cronKeyErrorMessage);

    return null;
  }

  const firestore = admin.firestore();

  const users = await requestAllUsers(firestore);
  const bills = await requestAllBills(firestore);
  const pendencies = await requestAllPendencies(firestore);

  // has to happen after requests for some reason
  res.send('Pendencies updates triggered');

  const promises = Object.keys(pendencies).map((key) => {
    const userPendencies = pendencies[key];
    return updatePendencies(firestore, userPendencies, users[userPendencies.id], bills);
  });
  return Promise.all(promises);
});
