import * as React from 'react';
import {Image, Text, View} from 'react-native';
import I18n from 'react-native-i18n';
import {Container} from 'native-base';

const en = {
  title: 'You have no bills',
  sub: 'To add, tap "CREATE" in the upper right corner of the screen',
};
const pt = {
  title: 'Você não possui contas',
  sub: 'Para adicionar, toque em "CRIAR" no canto superior direito da tela',
};

I18n.fallbacks = true;
I18n.translations = {
  en: {...I18n.translations.en, emptyBills: en},
  'pt-BR': {...I18n.translations['pt-BR'], emptyBills: pt},
};

export const EmptyBills = () => (
  <Container
    style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}
  >
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>{I18n.t('emptyBills.title')}</Text>
      <Image source={require('assets/img/empty-bills.png')} />
      <Text style={{fontSize: 16, textAlign: 'center'}}>{I18n.t('emptyBills.sub')}</Text>
    </View>
  </Container>
);
