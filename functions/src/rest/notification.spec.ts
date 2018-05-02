import {messaging} from 'firebase-admin';

import {mockedUser} from '../../__mocks__';
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

    await sendNotificationToDevice(messagingApi, mockedUser, 'Pendencies', 'message');

    const notification = {
      sound: 'default',
      priority: 'high',
      title: 'Pendencies',
      body: 'message',
    };
    expect(mockedSendToDevice.mock.calls[0]).toEqual([mockedUser.fcmToken, {notification}]);
  });
});
