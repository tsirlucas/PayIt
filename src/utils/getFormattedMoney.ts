import {I18n} from './i18n';

export const getFormattedMoney = (value: number) => {
  return `${I18n.toCurrency(value, {
    delimiter: I18n.t('utils.valueDelimiter'),
    separator: I18n.t('utils.valueSeparator'),
    unit: I18n.t('utils.valueSymbol'),
  })}`;
};
