import * as moment from 'moment';

type Moment = moment.Moment;

export const createCleanDate = (date: number, month: number): Moment => {
  const momentDate = moment({date, month});
  if (momentDate.isValid()) return momentDate;
  return createCleanDate(date - 1, month);
};
