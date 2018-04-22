import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as secureCompare from 'secure-compare';

import {UserPendencies} from 'models';

import {I18n} from './i18n';

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
    const promises: Promise<void>[] = [];
    documents.forEach((doc) => {
      promises.push(sendUserAlert(firestore, doc.data() as UserPendencies));
    });
    return Promise.all(promises);
  });
});

async function sendUserAlert(firestore: FirebaseFirestore.Firestore, pendencies: UserPendencies) {
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
  I18n.locale = user.i18n || 'en';

  if (delayedLength) {
    message = I18n.t('notification.delayedStart', {count: delayedLength});
  }

  if (!delayedLength && idealLength) {
    message = I18n.t('notification.idealStart', {message, count: idealLength});
  }

  if (delayedLength && idealLength) {
    message = I18n.t('notification.idealEnd', {message, count: idealLength});
  }
  if (message.length) {
    message = I18n.t('notification.tapAction', {message});

    await admin.messaging().sendToDevice(user.fcmToken, {
      notification: {
        sound: 'default',
        priority: 'high',
        title: I18n.t('notification.pendencies'),
        body: message,
      },
    });
  }
}
