import {Bill} from 'models';

import {createCleanDate} from '../../utils';

export const getBillMoments = (bill: Bill, month: number) => {
  const {expirationDay, generationDay} = bill;

  const expirationMoment = createCleanDate(expirationDay, month);
  let generationMoment = createCleanDate(generationDay, month);

  if (generationDay > expirationDay) {
    // bill is generated in the end of prev month and expires this month
    generationMoment = generationMoment.subtract(1, 'month');
  }

  return {expirationMoment, generationMoment};
};
