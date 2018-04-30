import {Moment} from 'moment';

import {Pendency} from 'models';

import {MomentData} from './model';

export const isDelayed = (today: Moment, expirationDay: Moment) => {
  return today.isAfter(expirationDay, 'day');
};

export const hasWarning = (payday: Moment, expirationDay: Moment) => {
  return payday.isAfter(expirationDay, 'day');
};

export const isIdeal = (
  today: Moment,
  payday: Moment,
  generationDay: Moment,
  expirationDay: Moment,
) => {
  const isGenerated = today.isSameOrAfter(generationDay, 'day');
  const isNotDelayed = !isDelayed(today, expirationDay);
  const shouldCheckPayday = !hasWarning(payday, expirationDay);
  const isAfterPayday = shouldCheckPayday ? today.isSameOrAfter(payday, 'day') : true;
  return isNotDelayed && isGenerated && isAfterPayday;
};

export const getType = ({
  todayMoment,
  generationMoment,
  expirationMoment,
  paydayMoment,
}: MomentData) => {
  switch (true) {
    case isDelayed(todayMoment, expirationMoment):
      return 'DELAYED';
    case isIdeal(todayMoment, paydayMoment, generationMoment, expirationMoment):
      return 'IDEAL';
    default:
      return 'NEXT';
  }
};

export const checkPaid = ({type}: Pendency) => {
  return type === 'PAID' ? type : null;
};
