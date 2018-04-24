import * as React from 'react';
import {Text} from 'react-native';
import {GestureResponderEvent, StyleSheet} from 'react-native';
import I18n from 'react-native-i18n';
import {Button} from 'native-base';
import {primaryColor} from 'style';

I18n.fallbacks = true;
I18n.translations = {
  en: {...I18n.translations.en, confirmButton: 'Confirm'},
  'pt-BR': {...I18n.translations['pt-BR'], confirmButton: 'Confirmar'},
};

export const confirmButtonStyle = StyleSheet.create({
  confirmButton: {
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: primaryColor,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  container: {
    paddingBottom: 100,
  },
});

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export const ConfirmButton = (props: Props) => (
  <Button
    disabled={props.disabled}
    onPress={props.onPress}
    style={[confirmButtonStyle.confirmButton, props.disabled ? {backgroundColor: 'gray'} : null]}
    block
    light
    bordered
  >
    <Text style={confirmButtonStyle.confirmButtonText}>{I18n.t('confirmButton')}</Text>
  </Button>
);
