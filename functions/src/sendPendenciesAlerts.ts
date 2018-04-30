import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import secureCompare from 'secure-compare';

import {User, UserPendencies} from 'models';

import {buildMessage, categorizePendencies} from './core/notification/notification';
import {sendNotificationToDevice} from './rest/notification';
import {requestAllPendencies} from './rest/pendency';
import {requestAllUsers} from './rest/user';

const cronKeyErrorMessage =
  'Security key does not match. Make sure your "key" URL query parameter matches the ' +
  'cron.key environment variable.';

const sendUserAlert = async (user: User, pendencies: UserPendencies) => {
  if (user.fcmToken) {
    const catPendencies = categorizePendencies(pendencies);

    const message = buildMessage(user, catPendencies);
    const messaging = admin.messaging();
    if (message) {
      await sendNotificationToDevice(messaging, user, message);
    }
  }
};

export const sendPendenciesAlerts = functions.https.onRequest(async (req, res) => {
  const queryKey = req.query.key;

  // Exit if the keys don't match.
  if (!secureCompare(queryKey, functions.config().cron.key)) {
    res.status(403).send(cronKeyErrorMessage);

    return null;
  }

  const firestore = admin.firestore();

  const pendencies = await requestAllPendencies(firestore);
  const users = await requestAllUsers(firestore);

  // has to happen after requests for some reason
  res.send('Pendencies alerts triggered');

  const promises = Object.keys(pendencies).map((key) => {
    const userPendencies = pendencies[key];
    const user = users[key];
    return sendUserAlert(user, userPendencies);
  });

  return Promise.all(promises);
});
