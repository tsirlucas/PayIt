import I18nCreator from 'react-native-i18n';
import en from './locales/en';
import pt from './locales/pt-BR';

I18nCreator.fallbacks = true;
I18nCreator.translations = {
  en: {...I18nCreator.translations.en, bills: en},
  'pt-BR': {...I18nCreator.translations['pt-BR'], bills: pt},
};

export const I18n = I18nCreator;
