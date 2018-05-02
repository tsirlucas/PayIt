import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

describe('sendPendenciesAlerts', () => {
  const testHelper = test();
  testHelper.mockConfig({cron: {key: 'cronKey'}});

  // // Mock needed data

  const dateString = '2018-02';
  const pendencyKey = `pendency-${dateString}`;
  const pendencyKey2 = `pendency2-${dateString}`;

  const mockedPendency = {
    id: pendencyKey,
    description: 'Random Outdated',
    expirationDay: '2018-02-20',
    value: 450.85,
    type: 'NEXT',
  };

  const mockedPendency2 = {
    id: pendencyKey2,
    description: 'Random Outdated',
    expirationDay: '2018-02-20',
    value: 450.85,
    type: 'NEXT',
  };

  const mockedUserPendency = {
    id: 'UID',
    data: {
      [pendencyKey]: mockedPendency,
    },
  };

  const mockedUserPendency2 = {
    id: 'UID2',
    data: {
      [pendencyKey2]: mockedPendency2,
    },
  };

  const mockedUser = {
    uid: 'UID',
    fcmToken: 'fmcToken',
  };

  const mockedUser2 = {
    uid: 'UID2',
  };

  const mockedPendencies = {
    [mockedUserPendency.id]: mockedUserPendency,
    [mockedUserPendency2.id]: mockedUserPendency2,
  };

  const mockedUsers = {[mockedUser.uid]: mockedUser, [mockedUser2.uid]: mockedUser2};

  // Mock functions and requests

  const mockedRequestallUsers = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedUsers)));

  const mockedRequestAllPendencies = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedPendencies)));

  const mockedCategorizePendencies = jest.fn().mockReturnValue({category: 'mockedResult'});
  const mockedBuildMessage = jest.fn().mockReturnValue('mocked message');
  const mockedSendNotificationToDevice = jest.fn();

  jest.mock('./rest/user', () => ({
    requestAllUsers: mockedRequestallUsers,
  }));

  jest.mock('./rest/pendency', () => ({
    requestAllPendencies: mockedRequestAllPendencies,
  }));

  jest.mock('./core/notification', () => ({
    categorizePendencies: mockedCategorizePendencies,
    buildMessage: mockedBuildMessage,
  }));

  jest.mock('./rest/notification', () => ({
    sendNotificationToDevice: mockedSendNotificationToDevice,
  }));

  jest.doMock('firebase-admin', () => ({
    firestore: () => null as Firestore,
    messaging: () => null as Object,
  }));

  const {sendPendenciesAlerts} = require('./sendPendenciesAlerts');

  it(
    'should call functions with right parameters only for users that have fcmToken',
    (done) => {
      const res = {
        send: () => {
          try {
            expect(mockedCategorizePendencies.mock.calls.length).toBe(1);
            expect(mockedCategorizePendencies.mock.calls[0]).toEqual([mockedUserPendency]);
            expect(mockedBuildMessage).toBeCalledWith(mockedUser, mockedCategorizePendencies());
            expect(mockedSendNotificationToDevice).toBeCalledWith(
              null,
              mockedUser,
              mockedBuildMessage(),
            );
            done();
          } catch (e) {
            done(e);
          }
        },
      };

      sendPendenciesAlerts({query: {key: 'cronKey'}}, res);
    },
    10000,
  );

  it(
    'should only work with cronKey',
    (done) => {
      const res = {
        status: () => ({
          send: () => {
            try {
              expect(mockedCategorizePendencies.mock.calls.length).toBe(0);
              expect(mockedBuildMessage.mock.calls.length).toBe(0);
              done();
            } catch (e) {
              done(e);
            }
          },
        }),
      };

      mockedCategorizePendencies.mockReset();
      mockedBuildMessage.mockReset();

      sendPendenciesAlerts({query: {key: 'cronKeyError'}}, res);
    },
    10000,
  );
});
