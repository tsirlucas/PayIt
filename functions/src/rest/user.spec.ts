import {CollectionReference, Firestore} from '@google-cloud/firestore';

import {getUserPendencies, requestAllUsers} from './user';

describe('user rest', () => {
  const collectionSkeleton = {} as CollectionReference;
  const mockedFirestoreSkeleton = {
    doc: () => null,
    getAll: () => null,
    getCollections: () => null,
    runTransaction: () => null,
    batch: () => null,
    collection: (_collectionPath: string) => collectionSkeleton,
  } as Firestore;

  const mockedUser = {uid: 'id1'};
  const mockedUser2 = {uid: 'id2'};

  it('should requestAllUsers correctly', async () => {
    const mockedUserSnapData = jest.fn().mockReturnValue(mockedUser);
    const mockedUserSnapData2 = jest.fn().mockReturnValue(mockedUser2);

    const snapshot = [{data: mockedUserSnapData}, {data: mockedUserSnapData2}];
    const mockedGet = jest.fn().mockReturnValue(snapshot);

    const mockedCollection = jest
      .fn<CollectionReference>()
      .mockReturnValue(Object.assign(collectionSkeleton, {get: mockedGet}));

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      collection: mockedCollection,
    });

    const users = await requestAllUsers(mockedFirestore);

    expect(mockedCollection).toBeCalledWith('/users');
    expect(mockedGet).toBeCalled();
    expect(mockedUserSnapData).toBeCalled();
    expect(mockedUserSnapData2).toBeCalled();
    expect(users).toEqual({id1: mockedUser, id2: mockedUser2});
  });

  it('should requestUserPendencies correctly', async () => {
    const mockedPendency = {id: 'id1', description: 'bill 1'};
    const mockedPendency2 = {id: 'id2', description: 'bill 2'};
    const mockedIndexedPendencies = {
      [mockedPendency.id]: mockedPendency,
      [mockedPendency2.id]: mockedPendency2,
    };
    const mockedUserSnapData = jest.fn().mockReturnValue(mockedUser);
    const userPendenciesSnapData = jest
      .fn()
      .mockReturnValue({id: 'id1', data: mockedIndexedPendencies});

    const userSnapshot = {data: mockedUserSnapData};
    const userPendenciesSnapshot = {data: userPendenciesSnapData};

    const mockedGetUser = jest.fn().mockReturnValue(userSnapshot);
    const mockedGetUserPendencies = jest.fn().mockReturnValue(userPendenciesSnapshot);

    const mockedDoc = jest.fn<CollectionReference>((path: string) => {
      if (path.includes('user')) return Object.assign(collectionSkeleton, {get: mockedGetUser});
      return Object.assign(collectionSkeleton, {get: mockedGetUserPendencies});
    });

    const mockedFirestore = Object.assign(mockedFirestoreSkeleton, {
      doc: mockedDoc,
    });

    const userAndPendencies = await getUserPendencies(mockedFirestore, 'id1');

    expect(mockedDoc.mock.calls[0]).toEqual(['/users/id1']);
    expect(mockedDoc.mock.calls[1]).toEqual(['/pendencies/id1']);
    expect(mockedGetUser).toBeCalled();
    expect(mockedGetUserPendencies).toBeCalled();
    expect(mockedUserSnapData).toBeCalled();
    expect(userPendenciesSnapData).toBeCalled();
    expect(userAndPendencies).toEqual({
      user: mockedUser,
      pendencies: userPendenciesSnapData(),
    });
  });
});
