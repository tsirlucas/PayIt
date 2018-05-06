import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

import {
  mockedPendency,
  mockedPendency2,
  mockedPendency3,
  mockedUser,
  mockedUser2,
  pendencyKey,
  pendencyKey2,
  pendencyKey3,
} from 'tests';

describe('sendPendenciesAlerts', () => {
  const testHelper = test();
  testHelper.mockConfig({cron: {key: 'cronKey'}});

  // // Mock needed data

  const mockedUserWithI18n = {
    ...mockedUser2,
    i18n: 'pt-BR',
  };

  const mockedUser3 = {
    uid: 'UID3',
  };

  const mockedUserPendency = {
    id: mockedUser.uid,
    data: {
      [pendencyKey]: mockedPendency,
    },
  };

  const mockedUserPendency2 = {
    id: mockedUserWithI18n.uid,
    data: {
      [pendencyKey2]: mockedPendency2,
    },
  };

  const mockedUserPendency3 = {
    id: mockedUser3.uid,
    data: {
      [pendencyKey3]: mockedPendency3,
    },
  };

  const mockedPendencies = {
    [mockedUserPendency.id]: mockedUserPendency,
    [mockedUserPendency2.id]: mockedUserPendency2,
    [mockedUserPendency3.id]: mockedUserPendency3,
  };

  const mockedUsers = {
    [mockedUser.uid]: mockedUser,
    [mockedUserWithI18n.uid]: mockedUserWithI18n,
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
              mockedUserWithI18n,
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
