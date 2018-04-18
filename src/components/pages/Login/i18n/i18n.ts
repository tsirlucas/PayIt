import I18nCreator from 'react-native-i18n';
import en from './locales/en';
import pt from './locales/pt-BR';

I18nCreator.fallbacks = true;
I18nCreator.translations = {
  en: {...I18nCreator.translations.en, login: en},
  'pt-BR': {...I18nCreator.translations['pt-BR'], login: pt},
};

export const I18n = I18nCreator;
