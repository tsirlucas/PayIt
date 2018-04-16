import * as moment from 'moment';

export const computePendencies = (bill, pendencies, payday) => {
  const today = moment();

  const month = today.month();
  const {expirationDay, generationDay} = bill;

  const expirationMoment = moment({date: expirationDay, month});
  const generationMoment = moment({date: generationDay, month});
  const paydayMoment = moment({date: payday, month});

  const expirationString = expirationMoment.format('YYYY-MM-DD');
  const pendencyKey = `${bill.id}-${expirationString}`;

  const currPendency = pendencies[pendencyKey] || buildPendency(bill, expirationString);
  const type = checkPaid(currPendency) || getType(today, generationMoment, expirationMoment);

  const newPendency = {
    ...buildPendency(bill, expirationString),
    type,
    warning: hasWarning(payday, expirationMoment),
  };

  return {[pendencyKey]: newPendency};
};

const isDelayed = (today, expirationDay) => {
  return today.diff(expirationDay) > 0;
};

const hasWarning = (payday, expirationDay) => {
  return expirationDay.diff(payday) > 0;
};

const isIdeal = (today, generationDay, expirationDay) => {
  const isGenerated = today.diff(generationDay) >= 0;
  const isNotDelayed = !isDelayed(today, expirationDay);
  return isNotDelayed && isGenerated;
};

const getType = (today, generationDay, expirationDay) => {
  switch (true) {
    case isDelayed(today, expirationDay):
      return 'DELAYED';
    case isIdeal(today, generationDay, expirationDay):
      return 'IDEAL';
    default:
      return 'NEXT';
  }
};

const checkPaid = ({type}) => (type === 'PAID' ? type : null);

const buildPendency = (bill, expiration, warning?) => ({
  description: bill.description,
  billId: bill.id,
  expirationDay: expiration,
  warning,
});
