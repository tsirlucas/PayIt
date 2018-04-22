import * as moment from 'moment';

import {Bill, IndexedPendencies, Pendency} from 'models';

export function computePendencies(bill: Bill, pendencies: IndexedPendencies, payday: number) {
  const today = moment();

  const month = today.month();
  const {expirationDay, generationDay} = bill;

  const expirationMoment = createCleanDate(expirationDay, month);
  let generationMoment = createCleanDate(generationDay, month);

  if (generationDay > expirationDay) {
    // bill is generated in the end of prev month and expires this month
    generationMoment = generationMoment.subtract(1, 'month');
  }

  const paydayMoment = createCleanDate(payday, month);

  const expirationString = expirationMoment.format('YYYY-MM-DD');
  const expirationStringWODay = expirationMoment.format('YYYY-MM');
  const pendencyKey = `${bill.id}-${expirationStringWODay}`;

  const newPendencyData = buildPendency(bill, pendencyKey, expirationString);
  const currPendency = pendencies[pendencyKey] || ({} as Pendency);

  const updatedPendency = {...currPendency, ...newPendencyData};

  const type = checkPaid(currPendency) || getType(today, generationMoment, expirationMoment);
  let value = currPendency.value;

  if (!value || (type === 'NEXT' || type === 'NONE')) value = bill.value;

  const newPendency = {
    ...updatedPendency,
    type,
    value,
    warning: hasWarning(paydayMoment, expirationMoment),
  };

  return {[pendencyKey]: newPendency};
}

function isDelayed(today: moment.Moment, expirationDay: moment.Moment) {
  return today.diff(expirationDay) > 0;
}

function hasWarning(payday: moment.Moment, expirationDay: moment.Moment) {
  return payday.diff(expirationDay) > 0;
}

function isIdeal(today: moment.Moment, generationDay: moment.Moment, expirationDay: moment.Moment) {
  const isGenerated = today.diff(generationDay) >= 0;
  const isNotDelayed = !isDelayed(today, expirationDay);
  return isNotDelayed && isGenerated;
}

function getType(today: moment.Moment, generationDay: moment.Moment, expirationDay: moment.Moment) {
  switch (true) {
    case isDelayed(today, expirationDay):
      return 'DELAYED';
    case isIdeal(today, generationDay, expirationDay):
      return 'IDEAL';
    default:
      return 'NEXT';
  }
}

function createCleanDate(date: number, month: number): moment.Moment {
  const momentDate = moment({date, month});
  if (momentDate.isValid()) return momentDate;
  return createCleanDate(date - 1, month);
}

function checkPaid({type}: Pendency) {
  return type === 'PAID' ? type : null;
}

function buildPendency(bill: Bill, id: string, expiration: string, warning?: boolean) {
  return {
    id,
    description: bill.description,
    billId: bill.id,
    expirationDay: expiration,
    warning: warning,
  };
}
