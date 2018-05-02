import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

describe('updateAllPendencies', () => {
  const testHelper = test();
  testHelper.mockConfig({cron: {key: 'cronKey'}});

  // // Mock needed data

  const mockedBill = {
    id: 'ID',
    description: 'Random New',
    generationDay: 15,
    expirationDay: 25,
    frequency: 'MONTHLY',
    permissions: {['UID']: 'AUTHOR'},
    type: 'BILL',
    value: 480.85,
  };

  const mockedBill2 = {
    id: 'ID2',
    description: 'Random New',
    generationDay: 15,
    expirationDay: 25,
    frequency: 'MONTHLY',
    permissions: {['UID']: 'AUTHOR'},
    type: 'BILL',
    value: 480.85,
  };

  const dateString = '2018-02';
  const pendencyKey = `${mockedBill.id}-${dateString}`;
  const pendencyKey2 = `${mockedBill2.id}-${dateString}`;

  const mockedPendency = {
    id: pendencyKey,
    billId: mockedBill.id,
    description: 'Random Outdated',
    expirationDay: '2018-02-20',
    value: 450.85,
    type: 'NEXT',
  };

  const mockedPendency2 = {
    id: pendencyKey2,
    billId: mockedBill2.id,
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
    payday: 5,
  };

  const mockedUser2 = {
    uid: 'UID2',
    payday: 10,
  };

  const mockedBills = {
    [mockedBill.id]: mockedBill,
    [mockedBill2.id]: mockedBill2,
  };

  const mockedPendencies = {
    [mockedUserPendency.id]: mockedUserPendency,
    [mockedUserPendency2.id]: mockedUserPendency2,
  };

  const mockedUsers = {[mockedUser.uid]: mockedUser, [mockedUser2.uid]: mockedUser2};

  // Mock functions and requests

  const mockedRequestAllBills = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedBills)));

  const mockedRequestallUsers = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedUsers)));

  const mockedRequestAllPendencies = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedPendencies)));

  const mockedComputeBillPendency = jest
    .fn()
    .mockReturnValueOnce({id: 'ID'})
    .mockReturnValueOnce({id: 'ID2'});

  const mockedSetPendencies = jest.fn();

  jest.mock('./rest/user', () => ({
    requestAllUsers: mockedRequestallUsers,
  }));

  jest.mock('./rest/bill', () => ({
    requestAllBills: mockedRequestAllBills,
  }));

  jest.mock('./rest/pendency', () => ({
    requestAllPendencies: mockedRequestAllPendencies,
    setPendencies: mockedSetPendencies,
  }));

  jest.mock('./core/pendency', () => ({
    computeBillPendency: mockedComputeBillPendency,
  }));

  jest.doMock('firebase-admin', () => ({
    firestore: () => null as Firestore,
  }));

  const {updateAllPendencies} = require('./updateAllPendencies');

  it(
    'should call functions with right parameters only for users that have fcmToken',
    (done) => {
      const res = {
        send: () => {
          try {
            expect(mockedComputeBillPendency.mock.calls.length).toBe(2);
            expect(mockedComputeBillPendency.mock.calls[0]).toEqual([
              mockedBill,
              mockedUserPendency.data,
              mockedUser.payday,
            ]);
            expect(mockedComputeBillPendency.mock.calls[1]).toEqual([
              mockedBill2,
              mockedUserPendency2.data,
              mockedUser2.payday,
            ]);
            expect(mockedSetPendencies.mock.calls[0]).toEqual([null, mockedUser, {ID: {id: 'ID'}}]);
            expect(mockedSetPendencies.mock.calls[1]).toEqual([
              null,
              mockedUser2,
              {ID2: {id: 'ID2'}},
            ]);
            done();
          } catch (e) {
            done(e);
          }
        },
      };

      updateAllPendencies({query: {key: 'cronKey'}}, res);
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
              expect(mockedComputeBillPendency.mock.calls.length).toBe(0);
              done();
            } catch (e) {
              done(e);
            }
          },
        }),
      };

      mockedComputeBillPendency.mockReset();

      updateAllPendencies({query: {key: 'cronKeyError'}}, res);
    },
    10000,
  );
});
