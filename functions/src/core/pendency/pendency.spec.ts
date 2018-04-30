import {IndexedPendencies} from 'models';

import {computeBillPendency} from './pendency';

const mockDateString = (day: number) => `2018-02-${day}T04:41:20`;
const mockDateStringWODay = () => '2018-02';
const mockDateStringWOHours = (day: number) => `2018-02-${day}`;

const mockDate = (day: number) => {
  const DATE_TO_USE = new Date(mockDateString(day));
  const _Date = Date;
  global.Date.parse = _Date.parse;
  global.Date.UTC = _Date.UTC;
  global.Date.now = jest.fn(() => DATE_TO_USE);
};

describe('computeBillPendency', () => {
  it("should return new pendency when it doesn't exist", () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random',
      generationDay: 15,
      expirationDay: 20,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 450.85,
    };

    const result = computeBillPendency(mockedBill, {}, 10);

    expect(result.billId).toEqual(mockedBill.id);
    expect(result.description).toEqual(mockedBill.description);
  });

  it("should return updated pendency when it does exist and isn't generated", () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random New',
      generationDay: 15,
      expirationDay: 25,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 480.85,
    };

    mockDate(10);
    const dateString = mockDateStringWODay();

    const pendencyKey = `${mockedBill.id}-${dateString}`;

    const outdatedPendency = {
      id: pendencyKey,
      description: 'Random Outdated',
      expirationDay: mockDateStringWOHours(20),
      value: 450.85,
      type: 'NEXT',
    };

    const result = computeBillPendency(
      mockedBill,
      {[pendencyKey]: outdatedPendency} as IndexedPendencies,
      10,
    );

    expect(result.description).toEqual(mockedBill.description);
    expect(result.expirationDay).toEqual(mockDateStringWOHours(25));
    expect(result.value).toEqual(mockedBill.value);
    expect(result.type).toEqual('NEXT');
  });

  it('should update only name and type when pendency is already generated', () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random New',
      generationDay: 10,
      expirationDay: 15,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 480.85,
    };

    mockDate(17);
    const dateString = mockDateStringWODay();
    const pendencyKey = `${mockedBill.id}-${dateString}`;

    const outdatedPendency = {
      id: pendencyKey,
      description: 'Random Outdated',
      expirationDay: mockDateStringWOHours(20),
      value: 450.85,
      type: 'IDEAL',
    };

    const result = computeBillPendency(
      mockedBill,
      {[pendencyKey]: outdatedPendency} as IndexedPendencies,
      10,
    );

    expect(result.description).toEqual(mockedBill.description);
    expect(result.expirationDay).toEqual(outdatedPendency.expirationDay);
    expect(result.value).toEqual(outdatedPendency.value);
    expect(result.type).toEqual('DELAYED');
  });

  it('should return ideal right', () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random',
      generationDay: 15,
      expirationDay: 20,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 450.85,
    };
    mockDate(15);

    const AFTER_PAYDAY_ON_GENERATION_BEFORE_EXPIRATION = computeBillPendency(mockedBill, {}, 10);
    const ON_PAYDAY_ON_GENERATION_BEFORE_EXPIRATION = computeBillPendency(mockedBill, {}, 15);

    mockDate(20);

    const AFTER_PAYDAY_AFTER_GENERATION_ON_EXPIRATION = computeBillPendency(mockedBill, {}, 15);
    const ON_PAYDAY_AFTER_GENERATION_ON_EXPIRATION = computeBillPendency(mockedBill, {}, 20);

    const reversedDaysBill = {
      ...mockedBill,
      generationDay: 25,
      expirationDay: 24,
    };

    mockDate(15);

    const REVERSED_AFTER_PAYDAY_AFTER_GENERATION_BEFORE_EXPIRATION = computeBillPendency(
      reversedDaysBill,
      {},
      10,
    );

    mockDate(17);

    const REVERSED_BEFORE_PAYDAY_AFTER_GENERATION_BEFORE_EXPIRATION_EXPIRES_BEFORE_PAYDAY = computeBillPendency(
      reversedDaysBill,
      {},
      25,
    );

    expect(AFTER_PAYDAY_ON_GENERATION_BEFORE_EXPIRATION.type).toEqual('IDEAL');
    expect(ON_PAYDAY_ON_GENERATION_BEFORE_EXPIRATION.type).toEqual('IDEAL');
    expect(AFTER_PAYDAY_AFTER_GENERATION_ON_EXPIRATION.type).toEqual('IDEAL');
    expect(ON_PAYDAY_AFTER_GENERATION_ON_EXPIRATION.type).toEqual('IDEAL');
    expect(REVERSED_AFTER_PAYDAY_AFTER_GENERATION_BEFORE_EXPIRATION.type).toEqual('IDEAL');
    expect(
      REVERSED_BEFORE_PAYDAY_AFTER_GENERATION_BEFORE_EXPIRATION_EXPIRES_BEFORE_PAYDAY.type,
    ).toEqual('IDEAL');
  });

  it('should return delayed right', () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random',
      generationDay: 15,
      expirationDay: 20,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 450.85,
    };

    mockDate(21);

    const AFTER_EXPIRATION = computeBillPendency(mockedBill, {}, 10);

    const reversedDaysBill = {
      ...mockedBill,
      generationDay: 25,
      expirationDay: 24,
    };

    mockDate(25);

    const REVERSED_AFTER_EXPIRATION = computeBillPendency(reversedDaysBill, {}, 10);

    expect(AFTER_EXPIRATION.type).toEqual('DELAYED');
    expect(REVERSED_AFTER_EXPIRATION.type).toEqual('DELAYED');
  });

  it('should return next right', () => {
    const mockedBill = {
      id: 'ID',
      description: 'Random',
      generationDay: 20,
      expirationDay: 25,
      frequency: 'MONTHLY',
      permissions: {['UID']: 'AUTHOR'},
      type: 'BILL',
      value: 450.85,
    };

    mockDate(15);

    const AFTER_PAYDAY_BEFORE_GENERATION = computeBillPendency(mockedBill, {}, 10);

    mockDate(21);

    const BEFORE_PAYDAY_AFTER_GENERATION = computeBillPendency(mockedBill, {}, 23);

    expect(AFTER_PAYDAY_BEFORE_GENERATION.type).toEqual('NEXT');
    expect(BEFORE_PAYDAY_AFTER_GENERATION.type).toEqual('NEXT');
  });
});
