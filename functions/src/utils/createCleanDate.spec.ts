import {createCleanDate} from './createCleanDate';

describe('createCleanDate util', () => {
  const mockDateString = (day: number) => `2018-05-${day}T04:41:20`;

  const mockDate = (day: number) => {
    const DATE_TO_USE = new Date(mockDateString(day));
    const _Date = Date;
    global.Date.parse = _Date.parse;
    global.Date.UTC = _Date.UTC;
    global.Date.now = jest.fn(() => DATE_TO_USE);
  };

  it("should pick sooner day when it doesn't exist", async () => {
    mockDate(10);

    const result = createCleanDate(31, 1);
    expect(result.date()).toEqual(28);
  });
});
