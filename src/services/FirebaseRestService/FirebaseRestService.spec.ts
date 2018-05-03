describe('FirebaseRestService', () => {
  const resultData = () => ({result: 'result'});
  const mockedDock = {id: 'id', exists: true, data: resultData};
  const get = jest.fn().mockReturnValue(mockedDock);
  const set = jest.fn();
  const update = jest.fn();
  const mockedDelete = jest.fn();
  const onSnapshot = jest.fn((cb) => cb({exists: true, data: resultData}));
  const mockedDoc = jest
    .fn()
    .mockReturnValue({id: 'docId', onSnapshot, get, set, update, delete: mockedDelete});
  const whereOnShapshot = jest.fn((cb) =>
    cb({docChanges: [{type: 'change', doc: {data: resultData}}]}),
  );
  const mockedWhere = jest.fn().mockReturnValue({onSnapshot: whereOnShapshot});
  const mockedCollection = jest.fn().mockReturnValue({doc: mockedDoc, where: mockedWhere});
  const mockedFirestore = jest.fn().mockReturnValue({collection: mockedCollection});
  const mockedFirebase = {firestore: mockedFirestore};
  const mockedInstance = jest.fn().mockReturnValue({Firebase: mockedFirebase});
  const mockedFirebaseSingleton = {getInstance: mockedInstance};

  jest.doMock('./FirebaseSingleton', () => ({FirebaseSingleton: mockedFirebaseSingleton}));

  const {FirebaseRestService} = require('./FirebaseRestService');

  // Mocked data
  const mockedData = {data: 'data'};
  const service = new FirebaseRestService('random');

  it('should return service with right entity', async () => {
    expect(mockedCollection).toBeCalledWith('random');
    expect(service).toBeTruthy();
  });

  it('should get an entity with firestore', async () => {
    const result = await service.get('id');
    expect(mockedDoc).toBeCalledWith('id');
    expect(result).toEqual({id: 'id', result: 'result'});
  });

  it('should create an entity with firestore', async () => {
    await service.create(mockedData);
    expect(mockedDoc).toBeCalled();
    expect(set).toBeCalledWith({id: 'docId', ...mockedData});
  });

  it("should set an entity with in firestore if it doesn't exist", async () => {
    await service.set(null, mockedData);
    expect(mockedDoc).toBeCalled();
    expect(set).toBeCalledWith(mockedData);
  });

  it('should update an entity with in firestore if it exists', async () => {
    await service.set('id', mockedData);
    expect(mockedDoc).toBeCalled();
    expect(update).toBeCalledWith(mockedData);
  });

  it('should delete an entity with firestore', async () => {
    await service.delete('id');
    expect(mockedDoc).toBeCalledWith('id');
    expect(mockedDelete).toBeCalled();
  });

  it('should subscribe to a document change', async () => {
    const cb = jest.fn();
    await service.subscribeDocument('id', cb);
    expect(mockedDoc).toBeCalledWith('id');
    expect(onSnapshot).toBeCalled();
    expect(cb).toBeCalled();
  });

  it('should subscribe to a collection change', async () => {
    const cb = jest.fn();
    await service.subscribeCollection(cb, ['1', '2', '3']);
    expect(mockedWhere).toBeCalledWith('1', '2', '3');
    expect(whereOnShapshot).toBeCalled();
    expect(cb).toBeCalledWith({type: 'change', data: resultData()});
  });
});
