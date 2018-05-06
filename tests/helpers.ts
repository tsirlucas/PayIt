export const mockDateString = (day: number) => `2018-02-${day}T04:41:20`;
export const mockDateStringWODay = () => '2018-02';
export const mockDateStringWOHours = (day: number) => `2018-02-${day}`;

export const mockDate = (day: number) => {
  const DATE_TO_USE = new Date(mockDateString(day));
  const _Date = Date;
  global.Date.parse = _Date.parse;
  global.Date.UTC = _Date.UTC;
  global.Date.now = jest.fn(() => DATE_TO_USE);
};
