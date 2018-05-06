import {CollectionReference, Firestore} from '@google-cloud/firestore';

import {IndexedPendencies} from 'models';
import {mockedPendency, mockedPendency2, mockedUser} from 'tests';

import {requestAllPendencies, requestUserPendencies, setPendencies, setPendency} from './pendency';

describe('pendency rest', () => {
  const collectionSkeleton = {} as CollectionReference;
  const mockedFirestoreSkeleton = {
    doc: () => null,
    getAll: () => null,
    getCollections: () => null,
    runTransaction: () => null,
    batch: () => null,
    collection: (_collectionPath: string) => collectionSkeleton,
  } as Firestore;

  const mockedPendencies = {
    [mockedPendency.id]: mockedPendency,
    [mockedPendency2.id]: mockedPendency2,
  } as {[index: string]: Object};

  it('should requestAllPendencies correctly', async () => {
    const mockedPendencySnapData = jest.fn().mockReturnValue(mockedPendency);
    const mockedPendencySnapData2 = jest.fn().mockReturnValue(mockedPendency2);

    const snapshot = [{data: mockedPendencySnapData}, {data: mockedPendencySnapData2}];
    const mockedGet = jest.fn().mockReturnValue(snapshot);

    const mockedCollection = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      collection: mockedCollection,
    });

    const pendencies = await requestAllPendencies(mockedFirestore);

    expect(mockedCollection).toBeCalledWith('/pendencies');
    expect(mockedGet).toBeCalled();
    expect(mockedPendencySnapData).toBeCalled();
    expect(mockedPendencySnapData2).toBeCalled();
    expect(pendencies).toEqual({
      [mockedPendency.id]: mockedPendency,
      [mockedPendency2.id]: mockedPendency2,
    });
  });

  it('should requestUserPendencies correctly', async () => {
    const mockedPendencySnapData = jest.fn().mockReturnValue(mockedPendency);

    const snapshot = {data: mockedPendencySnapData};
    const mockedGet = jest.fn().mockReturnValue(snapshot);

    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    const pendency = await requestUserPendencies(mockedFirestore, mockedUser.uid);

    expect(mockedDoc).toBeCalledWith(`/pendencies/${mockedUser.uid}`);
    expect(mockedGet).toBeCalled();
    expect(mockedPendencySnapData).toBeCalled();
    expect(pendency).toEqual(mockedPendency);
  });

  it('should setPendencies correctly', async () => {
    const mockedSet = jest.fn();
    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {set: mockedSet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    await setPendencies(mockedFirestore, mockedUser, mockedPendencies as IndexedPendencies);

    expect(mockedDoc).toBeCalledWith(`/pendencies/${mockedUser.uid}`);
    expect(mockedSet).toBeCalledWith({id: mockedUser.uid, data: mockedPendencies});
  });

  it("should setPendency correctly when pendency doesn't exist", async () => {
    const mockedUserPendencies = {id: mockedUser.uid, data: mockedPendencies};

    const mockedData = jest.fn().mockReturnValue(mockedUserPendencies);
    const mockedSet = jest.fn();
    const mockedGet = jest.fn().mockReturnValue({exists: false, data: mockedData});
    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {set: mockedSet, get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    await setPendency(mockedFirestore, mockedUser, mockedPendency);

    expect(mockedDoc).toBeCalledWith(`/pendencies/${mockedUser.uid}`);
    expect(mockedGet).toBeCalled();
    expect(mockedData.mock.calls.length).toBe(0);
    expect(mockedSet).toBeCalledWith({
      id: mockedUser.uid,
      data: {[mockedPendency.id]: mockedPendency},
    });
  });

  it('should setPendency correctly when exists', async () => {
    const mockedUserPendencies = {id: mockedUser.uid, data: mockedPendencies};

    const mockedData = jest.fn().mockReturnValue(mockedUserPendencies);
    const mockedSet = jest.fn();
    const mockedGet = jest.fn().mockReturnValue({exists: true, data: mockedData});
    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {set: mockedSet, get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    await setPendency(mockedFirestore, mockedUser, mockedPendency);

    expect(mockedDoc).toBeCalledWith(`/pendencies/${mockedUser.uid}`);
    expect(mockedGet).toBeCalled();
    expect(mockedData).toBeCalled();
    expect(mockedSet).toBeCalledWith({data: mockedPendencies}, {merge: true});
  });
});
