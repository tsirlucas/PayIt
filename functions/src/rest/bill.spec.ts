import {CollectionReference, Firestore} from '@google-cloud/firestore';

import {mockedBill, mockedBill2} from '../../__mocks__';
import {requestAllBills, requestBill} from './bill';

describe('bill rest', () => {
  const collectionSkeleton = {} as CollectionReference;
  const mockedFirestoreSkeleton = {
    doc: () => null,
    getAll: () => null,
    getCollections: () => null,
    runTransaction: () => null,
    batch: () => null,
    collection: (_collectionPath: string) => collectionSkeleton,
  } as Firestore;

  it('should requestAllBills correctly', async () => {
    const mockedBillSnapData = jest.fn().mockReturnValue(mockedBill);
    const mockedBillSnapData2 = jest.fn().mockReturnValue(mockedBill2);

    const snapshot = [{data: mockedBillSnapData}, {data: mockedBillSnapData2}];
    const mockedGet = jest.fn().mockReturnValue(snapshot);

    const mockedCollection = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      collection: mockedCollection,
    });

    const bills = await requestAllBills(mockedFirestore);

    expect(mockedCollection).toBeCalledWith('/bills');
    expect(mockedGet).toBeCalled();
    expect(mockedBillSnapData).toBeCalled();
    expect(mockedBillSnapData2).toBeCalled();
    expect(bills).toEqual({[mockedBill.id]: mockedBill, [mockedBill2.id]: mockedBill2});
  });

  it('should requestBill correctly', async () => {
    const mockedBillSnapData = jest.fn().mockReturnValue(mockedBill);

    const snapshot = {data: mockedBillSnapData};
    const mockedGet = jest.fn().mockReturnValue(snapshot);

    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    const bill = await requestBill(mockedFirestore, 'id1');

    expect(mockedDoc).toBeCalledWith('/bills/id1');
    expect(mockedGet).toBeCalled();
    expect(mockedBillSnapData).toBeCalled();
    expect(bill).toEqual(mockedBill);
  });
});
