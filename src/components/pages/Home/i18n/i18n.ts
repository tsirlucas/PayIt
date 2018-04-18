import I18nCreator from 'react-native-i18n';
import en from './locales/en';
import pt from './locales/pt-BR';

I18nCreator.fallbacks = true;
I18nCreator.translations = {
  en: {...I18nCreator.translations.en, home: en},
  'pt-BR': {...I18nCreator.translations['pt-BR'], home: pt},
};

export const I18n = I18nCreator;
