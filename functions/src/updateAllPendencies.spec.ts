import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

import {
  mockedBill,
  mockedBill2,
  mockedPendency,
  mockedPendency2,
  mockedUser,
  mockedUser2,
  pendencyKey,
  pendencyKey2,
} from '../__mocks__';

describe('updateAllPendencies', () => {
  const testHelper = test();
  testHelper.mockConfig({cron: {key: 'cronKey'}});

  // // Mock needed data

  const mockedUserWOToken = {
    ...mockedUser2,
    fcmToken: null as string,
  };

  const mockedUserPendency = {
    id: mockedUser.uid,
    data: {
      [pendencyKey]: mockedPendency,
    },
  };

  const mockedUserPendency2 = {
    id: mockedUserWOToken.uid,
    data: {
      [pendencyKey2]: mockedPendency2,
    },
  };

  const mockedBills = {
    [mockedBill.id]: mockedBill,
    [mockedBill2.id]: mockedBill2,
  };

  const mockedPendencies = {
    [mockedUserPendency.id]: mockedUserPendency,
    [mockedUserPendency2.id]: mockedUserPendency2,
  };

  const mockedUsers = {[mockedUser.uid]: mockedUser, [mockedUserWOToken.uid]: mockedUserWOToken};

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
              mockedUserWOToken,
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
