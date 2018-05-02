import {mockDate, mockDateString} from '../../__mocks__';
import {createCleanDate} from './createCleanDate';

describe('createCleanDate util', () => {
  it("should pick sooner day when it doesn't exist", async () => {
    mockDate(10);

    const result = createCleanDate(31, 1);
    expect(result.date()).toEqual(28);
  });
});
