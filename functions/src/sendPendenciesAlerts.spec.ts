import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

describe('sendPendenciesAlerts', () => {
  const testHelper = test();
  testHelper.mockConfig({cron: {key: 'cronKey'}});

  // // Mock needed data

  const dateString = '2018-02';
  const pendencyKey = `pendency-${dateString}`;
  const pendencyKey2 = `pendency2-${dateString}`;
  const pendencyKey3 = `pendency3-${dateString}`;

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

  const mockedPendency3 = {
    id: pendencyKey3,
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

  const mockedUserPendency3 = {
    id: 'UID3',
    data: {
      [pendencyKey2]: mockedPendency3,
    },
  };

  const mockedUser = {
    uid: 'UID',
    fcmToken: 'fmcToken',
  };

  const mockedUser2 = {
    uid: 'UID2',
    fcmToken: 'fmcToken2',
    i18n: 'pt-BR',
  };

  const mockedUser3 = {
    uid: 'UID3',
  };

  const mockedPendencies = {
    [mockedUserPendency.id]: mockedUserPendency,
    [mockedUserPendency2.id]: mockedUserPendency2,
    [mockedUserPendency3.id]: mockedUserPendency3,
  };

  const mockedUsers = {
    [mockedUser.uid]: mockedUser,
    [mockedUser2.uid]: mockedUser2,
    [mockedUser3.uid]: mockedUser3,
  };

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
    'should call functions with right parameters and i18n only for users that have fcmToken',
    (done) => {
      const res = {
        send: () => {
          try {
            expect(mockedCategorizePendencies.mock.calls.length).toBe(2);
            expect(mockedCategorizePendencies.mock.calls[0]).toEqual([mockedUserPendency]);
            expect(mockedCategorizePendencies.mock.calls[1]).toEqual([mockedUserPendency2]);
            expect(mockedBuildMessage).toBeCalledWith(mockedCategorizePendencies());
            expect(mockedSendNotificationToDevice.mock.calls[0]).toEqual([
              null,
              mockedUser,
              'Pendencies',
              mockedBuildMessage(),
            ]);
            expect(mockedSendNotificationToDevice.mock.calls[1]).toEqual([
              null,
              mockedUser2,
              'Pendências',
              mockedBuildMessage(),
            ]);
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
