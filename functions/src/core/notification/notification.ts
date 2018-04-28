import {CategorizedPendencies, User, UserPendencies} from 'models';

import {I18n} from '../../i18n';

export const categorizePendencies = (pendencies: UserPendencies) => {
  return Object.keys(pendencies.data || {}).reduce(
    (curr, next) => {
      const pendency = pendencies.data[next];
      if (pendency.type === 'DELAYED') curr.delayed.push(pendency);
      if (pendency.type === 'IDEAL') curr.ideal.push(pendency);
      return curr;
    },
    {
      delayed: [],
      ideal: [],
    } as CategorizedPendencies,
  );
};

export const buildMessage = (user: User, catPendencies: CategorizedPendencies) => {
  const delayedLength = catPendencies.delayed.length;
  const idealLength = catPendencies.ideal.length;
  let message;

  I18n.locale = user.i18n || 'en';

  if (delayedLength) {
    message = I18n.t('notification.delayedStart', {count: delayedLength});
  }

  if (!delayedLength && idealLength) {
    message = I18n.t('notification.idealStart', {message, count: idealLength});
  }

  if (delayedLength && idealLength) {
    message = I18n.t('notification.idealEnd', {message, count: idealLength});
  }

  if (message.length) {
    message = I18n.t('notification.tapAction', {message});
  }

  return message;
};
