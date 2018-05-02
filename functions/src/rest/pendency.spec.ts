import {CollectionReference, Firestore} from '@google-cloud/firestore';

import {IndexedPendencies, Pendency, User} from 'models';

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

  const mockedPendency = {id: 'id1', description: 'bill 1'};
  const mockedPendency2 = {id: 'id2', description: 'bill 2'};

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
    expect(pendencies).toEqual({id1: mockedPendency, id2: mockedPendency2});
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

    const pendency = await requestUserPendencies(mockedFirestore, 'id1');

    expect(mockedDoc).toBeCalledWith('/pendencies/id1');
    expect(mockedGet).toBeCalled();
    expect(mockedPendencySnapData).toBeCalled();
    expect(pendency).toEqual(mockedPendency);
  });

  it('should setPendencies correctly', async () => {
    const mockedUser = {uid: 'id1'};
    const mockedPendencies = {
      ['id1']: mockedPendency,
      ['id2']: mockedPendency2,
    } as {[index: string]: Object};

    const mockedSet = jest.fn();
    const mockedDoc = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {set: mockedSet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    await setPendencies(mockedFirestore, mockedUser as User, mockedPendencies as IndexedPendencies);

    expect(mockedDoc).toBeCalledWith('/pendencies/id1');
    expect(mockedSet).toBeCalledWith({id: mockedUser.uid, data: mockedPendencies});
  });

  it("should setPendency correctly when pendency doesn't exist", async () => {
    const mockedUser = {uid: 'id1'};
    const mockedPendencies = {
      ['id1']: mockedPendency,
      ['id2']: mockedPendency2,
    } as {[index: string]: Object};

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

    await setPendency(mockedFirestore, mockedUser as User, mockedPendency as Pendency);

    expect(mockedDoc).toBeCalledWith('/pendencies/id1');
    expect(mockedGet).toBeCalled();
    expect(mockedData.mock.calls.length).toBe(0);
    expect(mockedSet).toBeCalledWith({
      id: mockedUser.uid,
      data: {[mockedPendency.id]: mockedPendency},
    });
  });

  it('should setPendency correctly when exists', async () => {
    const mockedUser = {uid: 'id1'};
    const mockedPendencies = {
      ['id1']: mockedPendency,
      ['id2']: mockedPendency2,
    } as {[index: string]: Object};

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

    await setPendency(mockedFirestore, mockedUser as User, mockedPendency as Pendency);

    expect(mockedDoc).toBeCalledWith('/pendencies/id1');
    expect(mockedGet).toBeCalled();
    expect(mockedData).toBeCalled();
    expect(mockedSet).toBeCalledWith({data: mockedPendencies}, {merge: true});
  });
});
