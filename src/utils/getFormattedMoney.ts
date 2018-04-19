import {I18n} from './i18n';

export const getFormattedMoney = (value: number) => {
  return `${I18n.t('utils.valueSymbol')}${I18n.toNumber(value, {
    delimiter: I18n.t('utils.valueDelimiter'),
    separator: I18n.t('utils.valueSeparator'),
    strip_insignificant_zeros: true,
  })}`;
};
