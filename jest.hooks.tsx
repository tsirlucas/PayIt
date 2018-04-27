// tslint:disable-next-line:no-empty
jest.mock('react-native-google-signin', () => {});
jest.mock('react-native-splash-screen', () => {
  return {
    hide: jest.fn(),
    show: jest.fn(),
  };
});
