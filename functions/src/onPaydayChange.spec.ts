import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

import {
  mockedBill,
  mockedBill2,
  mockedPendency,
  mockedPendency2,
  mockedUpdatedPendency,
  mockedUpdatedPendency2,
  mockedUpdatedUser,
  mockedUser,
  pendencyKey,
  pendencyKey2,
} from '../__mocks__';

describe('onPaydayChange', () => {
  const testHelper = test();

  // Mock change snapshots
  const beforeSnap = testHelper.firestore.makeDocumentSnapshot(mockedUser, 'users/UID');

  const snap = testHelper.firestore.makeDocumentSnapshot(mockedUpdatedUser, 'users/UID');

  // Mock needed data

  const mockedResultData = {
    [pendencyKey]: mockedPendency,
    [pendencyKey2]: mockedPendency2,
  };

  const mockedResult = {
    id: 'UID',
    data: mockedResultData,
  };

  // Mock functions and requests

  const mockRequestUserPendencies = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedResult)));

  const mockedSetPendency = jest.fn();
  const mockRequestBill = jest
    .fn()
    .mockReturnValueOnce(new Promise((resolve) => resolve(mockedBill)))
    .mockReturnValueOnce(new Promise((resolve) => resolve(mockedBill2)));
  const mockedComputeBill = jest
    .fn()
    .mockReturnValueOnce(mockedUpdatedPendency)
    .mockReturnValueOnce(mockedUpdatedPendency2);

  jest.mock('./rest/pendency', () => ({
    requestUserPendencies: mockRequestUserPendencies,
    setPendency: mockedSetPendency,
  }));

  jest.mock('./rest/bill', () => ({
    requestBill: mockRequestBill,
  }));

  jest.mock('./core/pendency', () => ({
    computeBillPendency: mockedComputeBill,
  }));

  jest.doMock('firebase-admin', () => ({firestore: () => null as Firestore}));

  const {onPaydayChange} = require('./onPaydayChange');
  const wrapped = testHelper.wrap(onPaydayChange);

  it('should call computeBillPendencies and setPendency with right parameters', async () => {
    const change = testHelper.makeChange(beforeSnap, snap);

    await wrapped(change);

    expect(mockedComputeBill.mock.calls.length).toBe(2);
    expect(mockedSetPendency.mock.calls.length).toBe(2);
    expect(mockedComputeBill.mock.calls[0]).toEqual([mockedBill, mockedResultData, 10]);
    expect(mockedSetPendency.mock.calls[0]).toEqual([null, snap.data(), mockedUpdatedPendency]);
    expect(mockedComputeBill.mock.calls[1]).toEqual([mockedBill2, mockedResultData, 10]);
    expect(mockedSetPendency.mock.calls[1]).toEqual([null, snap.data(), mockedUpdatedPendency2]);
  });
});
