import {FirebaseSingleton} from './FirebaseSingleton';

it('should return Firebase as a public property', () => {
  expect(FirebaseSingleton.getInstance().Firebase).toBeTruthy();
});
