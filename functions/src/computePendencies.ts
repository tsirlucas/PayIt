import * as moment from 'moment';

import {Bill, IndexedPendencies, Pendency} from 'models';

export const computePendencies = (bill: Bill, pendencies: IndexedPendencies, payday: number) => {
  const today = moment();

  const month = today.month();
  const {expirationDay, generationDay} = bill;

  const expirationMoment = moment({date: expirationDay, month});
  let generationMoment = moment({date: generationDay, month});

  if (generationDay > expirationDay) {
    // bill is generated in the end of prev month and expires this month
    generationMoment = generationMoment.subtract(1, 'month');
  }

  const paydayMoment = moment({date: payday, month});

  const expirationString = expirationMoment.format('YYYY-MM-DD');
  const expirationStringWODay = expirationMoment.format('YYYY-MM');
  const pendencyKey = `${bill.id}-${expirationStringWODay}`;

  const newPendencyData = buildPendency(bill, expirationString);
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
};

const isDelayed = (today: moment.Moment, expirationDay: moment.Moment) => {
  return today.diff(expirationDay) > 0;
};

const hasWarning = (payday: moment.Moment, expirationDay: moment.Moment) => {
  return payday.diff(expirationDay) > 0;
};

const isIdeal = (
  today: moment.Moment,
  generationDay: moment.Moment,
  expirationDay: moment.Moment,
) => {
  const isGenerated = today.diff(generationDay) >= 0;
  const isNotDelayed = !isDelayed(today, expirationDay);
  return isNotDelayed && isGenerated;
};

const getType = (
  today: moment.Moment,
  generationDay: moment.Moment,
  expirationDay: moment.Moment,
) => {
  switch (true) {
    case isDelayed(today, expirationDay):
      return 'DELAYED';
    case isIdeal(today, generationDay, expirationDay):
      return 'IDEAL';
    default:
      return 'NEXT';
  }
};

const checkPaid = ({type}: Pendency) => (type === 'PAID' ? type : null);

const buildPendency = (bill: Bill, expiration: string, warning?: boolean) => ({
  description: bill.description,
  billId: bill.id,
  expirationDay: expiration,
  warning: warning,
});
