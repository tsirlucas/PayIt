import {Moment} from 'moment';

export interface MomentData {
  todayMoment: Moment;
  generationMoment: Moment;
  expirationMoment: Moment;
  paydayMoment: Moment;
}
