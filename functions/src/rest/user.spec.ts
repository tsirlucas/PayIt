import {CollectionReference, Firestore} from '@google-cloud/firestore';

import {mockedPendency, mockedPendency2, mockedUser, mockedUser2} from '../../__mocks__';
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
    expect(users).toEqual({[mockedUser.uid]: mockedUser, [mockedUser2.uid]: mockedUser2});
  });

  it('should requestUserPendencies correctly', async () => {
    const mockedIndexedPendencies = {
      [mockedPendency.id]: mockedPendency,
      [mockedPendency2.id]: mockedPendency2,
    };
    const mockedUserSnapData = jest.fn().mockReturnValue(mockedUser);
    const userPendenciesSnapData = jest
      .fn()
      .mockReturnValue({id: mockedUser.uid, data: mockedIndexedPendencies});

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

    const userAndPendencies = await getUserPendencies(mockedFirestore, mockedUser.uid);

    expect(mockedDoc.mock.calls[0]).toEqual([`/users/${mockedUser.uid}`]);
    expect(mockedDoc.mock.calls[1]).toEqual([`/pendencies/${mockedUser.uid}`]);
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
