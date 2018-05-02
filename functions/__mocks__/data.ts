import {Bill, Pendency, User, UserPendencies} from 'models';

export const mockedUser = {
  uid: 'UID',
  fullName: 'Random',
  displayName: null,
  email: null,
  payday: 5,
  fcmToken: 'token1',
} as User;

export const mockedUser2 = {
  ...mockedUser,
  uid: 'UID2',
  fullName: 'Random 2',
  payday: 10,
  fcmToken: 'token2',
} as User;

export const mockedUser3 = {
  ...mockedUser,
  uid: 'UID3',
  fullName: 'Random 3',
  payday: 20,
  fcmToken: 'token3',
} as User;

export const mockedUpdatedUser = {
  ...mockedUser,
  uid: 'UID',
  name: 'Random',
  payday: 10,
  fmcToken: 'token',
} as User;

export const mockedBill = {
  id: 'BILL-ID',
  description: 'Random Old',
  generationDay: 15,
  expirationDay: 20,
  frequency: 'MONTHLY',
  permissions: {['UID']: 'AUTHOR'},
  type: 'BILL',
  value: 450.85,
} as Bill;

export const mockedBill2 = {
  ...mockedBill,
  id: 'BILL-ID2',
  description: 'Random Old 2',
} as Bill;

export const mockedBill3 = {
  ...mockedBill,
  id: 'BILL-ID3',
  description: 'Random Old 3',
} as Bill;

export const mockedUpdatedBill = {
  ...mockedBill,
  description: 'Random New',
  value: 480.85,
} as Bill;

export const dateString = '2018-02';
export const pendencyKey = `${mockedBill.id}-${dateString}`;
export const pendencyKey2 = `${mockedBill2.id}-${dateString}`;
export const pendencyKey3 = `${mockedBill3.id}-${dateString}`;

export const mockedPendency = {
  id: pendencyKey,
  description: 'Random Outdated',
  expirationDay: '2018-02-20',
  value: 450.85,
  type: 'NEXT',
  billId: mockedBill.id,
} as Pendency;

export const mockedPendency2 = {
  ...mockedPendency,
  id: pendencyKey2,
  description: 'Random Outdated 2',
  billId: mockedBill2.id,
} as Pendency;

export const mockedPendency3 = {
  ...mockedPendency,
  id: pendencyKey3,
  description: 'Random Outdated 3',
  billId: mockedBill3.id,
} as Pendency;

export const mockedUpdatedPendency = {
  ...mockedPendency,
  description: 'Random New',
  expirationDay: '2018-02-25',
  value: 480.85,
} as Pendency;

export const mockedUpdatedPendency2 = {
  ...mockedPendency2,
  description: 'Random New 2',
  expirationDay: '2018-02-25',
  value: 480.85,
} as Pendency;
