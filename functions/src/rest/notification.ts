import {messaging} from 'firebase-admin';

import {User} from 'models';

import {I18n} from '../i18n';

export const sendNotificationToDevice = (api: messaging.Messaging, user: User, message: string) => {
  return api.sendToDevice(user.fcmToken, {
    notification: {
      sound: 'default',
      priority: 'high',
      title: I18n.t('notification.pendencies'),
      body: message,
    },
  });
};
