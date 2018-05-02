import {messaging} from 'firebase-admin';

import {User} from 'models';

import {sendNotificationToDevice} from './notification';

describe('notification rest', () => {
  it('should sendNotificationToDevice correctly', async () => {
    const mockedSendToDevice = jest.fn();

    const messagingApi = {
      app: null,
      send: null,
      sendToDeviceGroup: null,
      sendToTopic: null,
      sendToCondition: null,
      subscribeToTopic: null,
      unsubscribeFromTopic: null,
      sendToDevice: mockedSendToDevice,
    } as messaging.Messaging;

    const user = {uid: 'id1', fcmToken: 'fcmToken1'};

    await sendNotificationToDevice(messagingApi, user as User, 'Pendencies', 'message');

    const notification = {
      sound: 'default',
      priority: 'high',
      title: 'Pendencies',
      body: 'message',
    };
    expect(mockedSendToDevice.mock.calls[0]).toEqual([user.fcmToken, {notification}]);
  });
});
