import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as secureCompare from 'secure-compare';

import {computePendencies} from './computePendencies';

export const sendPendenciesAlerts = functions.https.onRequest((req, res) => {
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

  res.send('Pendencies alerts triggered');

  return documentsPromise.then((documents) => {
    const promises = [];
    documents.forEach((doc) => {
      promises.push(sendUserAlert(firestore, doc.data()));
    });
    return Promise.all(promises);
  });
});

const sendUserAlert = async (firestore: FirebaseFirestore.Firestore, pendencies) => {
  const userSnapshot = await firestore.doc(`/users/${pendencies.id}`).get();
  const user = userSnapshot.data();

  const catPendencies = Object.keys(pendencies.data || {}).reduce(
    (curr, next) => {
      const pendency = pendencies.data[next];
      if (pendency.type === 'DELAYED') curr.delayed.push(pendency);
      if (pendency.type === 'IDEAL') curr.ideal.push(pendency);
      return curr;
    },
    {
      delayed: [],
      ideal: [],
    },
  );
  let message = '';
  const delayedLength = catPendencies.delayed.length;
  const idealLength = catPendencies.ideal.length;
  if (delayedLength) {
    message = `Hey there, you have ${delayedLength} delayed ${idealLength > 1 ? 'bills' : 'bill'}`;
  }

  if (!delayedLength && idealLength) {
    message = `Hey there, you have ${idealLength} bills in the ideal moment to pay`;
  }

  if (delayedLength && idealLength) {
    message = `${message} and ${idealLength} in the ideal moment to pay`;
  }
  if (message.length) {
    message = `${message}. Tap to manage.`;
    const result = await admin.messaging().sendToDevice(user.fcmToken, {
      notification: {
        sound: 'default',
        priority: 'high',
        title: 'Pendencies',
        body: message,
      },
    });
    console.log(result);
  }
};
