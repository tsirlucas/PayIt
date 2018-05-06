import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

import {
  mockedBill,
  mockedPendency,
  mockedUpdatedBill,
  mockedUpdatedPendency,
  mockedUpdatedUser,
  pendencyKey,
} from 'tests';

describe('onBillChange', () => {
  const testHelper = test();

  // Mock change snapshots

  const beforeSnap = testHelper.firestore.makeDocumentSnapshot(mockedBill, 'bills/ID');

  const snap = testHelper.firestore.makeDocumentSnapshot(mockedUpdatedBill, 'bills/ID');

  // Mock needed data
  const mockedUserAndPendencies = {
    user: mockedUpdatedUser,
    pendencies: {
      id: 'UID',
      data: {
        [pendencyKey]: mockedPendency,
      },
    },
  };

  // Mock functions and requests

  const mockFunction = jest
    .fn()
    .mockReturnValue(new Promise((resolve) => resolve(mockedUserAndPendencies)));
  const mockedComputeBill = jest.fn().mockReturnValue(mockedUpdatedPendency);
  const mockedSetPendency = jest.fn();

  jest.mock('./rest/user', () => ({
    getUserPendencies: mockFunction,
  }));

  jest.mock('./core/pendency', () => ({
    computeBillPendency: mockedComputeBill,
  }));

  jest.mock('./rest/pendency', () => ({
    setPendency: mockedSetPendency,
  }));

  jest.doMock('firebase-admin', () => ({firestore: () => null as Firestore}));

  const {onBillChange} = require('./onBillChange');
  const wrapped = testHelper.wrap(onBillChange);

  it('should call computeBillPendencies and setPendency with right parameters', async () => {
    const change = testHelper.makeChange(beforeSnap, snap);

    await wrapped(change);
    expect(mockedComputeBill).toBeCalledWith(
      snap.data(),
      mockedUserAndPendencies.pendencies.data,
      10,
    );
    expect(mockedSetPendency).toBeCalledWith(null, mockedUpdatedUser, mockedUpdatedPendency);
  });
});
