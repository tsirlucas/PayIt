import {Moment} from 'moment';

import {Pendency} from 'models';

import {MomentData} from './model';

export const isDelayed = (today: Moment, expirationDay: Moment) => {
  return today.diff(expirationDay) > 0;
};

export const hasWarning = (payday: Moment, expirationDay: Moment) => {
  return payday.diff(expirationDay) > 0;
};

export const isIdeal = (today: Moment, generationDay: Moment, expirationDay: Moment) => {
  const isGenerated = today.diff(generationDay) >= 0;
  const isNotDelayed = !isDelayed(today, expirationDay);
  return isNotDelayed && isGenerated;
};

export const getType = ({todayMoment, generationMoment, expirationMoment}: MomentData) => {
  switch (true) {
    case isDelayed(todayMoment, expirationMoment):
      return 'DELAYED';
    case isIdeal(todayMoment, generationMoment, expirationMoment):
      return 'IDEAL';
    default:
      return 'NEXT';
  }
};

export const checkPaid = ({type}: Pendency) => {
  return type === 'PAID' ? type : null;
};
