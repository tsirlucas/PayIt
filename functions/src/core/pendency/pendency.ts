import * as moment from 'moment';

import {Bill, IndexedPendencies, Pendency} from 'models';

import {createCleanDate} from '../../utils';
import {getBillMoments} from '../bill';
import {checkPaid, getType, hasWarning} from './helpers';
import {MomentData} from './model';

type Moment = moment.Moment;

export const buildNewPendency = (bill: Bill, id: string, expiration: string, warning?: boolean) => {
  return {
    id,
    description: bill.description,
    billId: bill.id,
    expirationDay: expiration,
    warning: warning,
  };
};

export const buildPendency = (
  bill: Bill,
  pendencies: IndexedPendencies,
  expirationMoment: Moment,
) => {
  const expirationString = expirationMoment.format('YYYY-MM-DD');
  const expirationStringWODay = expirationMoment.format('YYYY-MM');
  const pendencyKey = `${bill.id}-${expirationStringWODay}`;

  const newPendencyData = buildNewPendency(bill, pendencyKey, expirationString);
  const currPendency = pendencies[pendencyKey] || ({} as Pendency);

  return {...currPendency, ...newPendencyData};
};

export const updatePendency = (pendency: Pendency, bill: Bill, momentData: MomentData) => {
  const type = checkPaid(pendency) || getType(momentData);

  let value = pendency.value;

  if (!value || (type === 'NEXT' || type === 'NONE')) value = bill.value;

  return {
    ...pendency,
    type,
    value,
    warning: hasWarning(momentData.paydayMoment, momentData.expirationMoment),
  };
};

export const buildMomentData = (bill: Bill, payday: number): MomentData => {
  const todayMoment = moment();
  const month = todayMoment.month();

  const {expirationMoment, generationMoment} = getBillMoments(bill, month);

  const paydayMoment = createCleanDate(payday, month);

  return {
    todayMoment,
    generationMoment,
    expirationMoment,
    paydayMoment,
  };
};

export const computeBillPendency = (bill: Bill, pendencies: IndexedPendencies, payday: number) => {
  const momentData = buildMomentData(bill, payday);
  const pendency = buildPendency(bill, pendencies, momentData.expirationMoment);

  const updatedPendency = updatePendency(pendency, bill, momentData);

  return updatedPendency;
};
