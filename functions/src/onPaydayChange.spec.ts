import {Firestore} from '@google-cloud/firestore';
import test from 'firebase-functions-test';

describe('onPaydayChange', () => {
  const testHelper = test();

  // Mock change snapshots
  const beforeSnap = testHelper.firestore.makeDocumentSnapshot(
    {
      uid: 'UID',
      name: 'Random',
      payday: 5,
      fmcToken: 'token',
    },
    'users/UID',
  );

  const snap = testHelper.firestore.makeDocumentSnapshot(
    {
      uid: 'UID',
      name: 'Random',
      payday: 10,
      fmcToken: 'token',
    },
    'users/UID',
  );

  // Mock needed data

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
    description: 'Random Outdated',
    expirationDay: '2018-02-20',
    value: 450.85,
    type: 'NEXT',
    billId: mockedBill.id,
  };

  const mockedPendency2 = {
    id: pendencyKey2,
    description: 'Random Outdated',
    expirationDay: '2018-02-20',
    value: 450.85,
    type: 'NEXT',
    billId: mockedBill2.id,
  };

  const updatedPendency = {
    id: pendencyKey,
    description: 'Random New',
    expirationDay: '2018-02-25',
    value: 480.85,
    type: 'NEXT',
  };

  const updatedPendency2 = {
    id: pendencyKey2,
    description: 'Random New',
    expirationDay: '2018-02-25',
    value: 480.85,
    type: 'NEXT',
  };

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
    .mockReturnValueOnce(updatedPendency)
    .mockReturnValueOnce(updatedPendency2);

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
    expect(mockedSetPendency.mock.calls[0]).toEqual([null, snap.data(), updatedPendency]);
    expect(mockedComputeBill.mock.calls[1]).toEqual([mockedBill2, mockedResultData, 10]);
    expect(mockedSetPendency.mock.calls[1]).toEqual([null, snap.data(), updatedPendency2]);
  });
});
