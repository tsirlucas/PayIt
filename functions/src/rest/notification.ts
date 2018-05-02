import {messaging} from 'firebase-admin';

import {User} from 'models';

export const sendNotificationToDevice = (
  api: messaging.Messaging,
  user: User,
  title: string,
  message: string,
) => {
  return api.sendToDevice(user.fcmToken, {
    notification: {
      sound: 'default',
      priority: 'high',
      title,
      body: message,
    },
  });
};
