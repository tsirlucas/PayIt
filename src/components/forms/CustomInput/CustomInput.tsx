import * as React from 'react';
import {Text, View} from 'react-native';
import {Input, Item, Label} from 'native-base';
import {$PropertyType} from 'utility-types';

import {style} from './CustomInput.style';

type Props = {
  label: string;
  errorMessage: string;
  valid: boolean;
  value: string | number;
  maxLength?: number;
  keyboardType?: string;
  onChangeText: (text: string | number) => void;
  onFocus?: () => void;
  mask?: (text: string | number) => string;
  unMask?: (text: string) => string | number;
};

type KeyboardType = 'numeric' | 'email-address' | 'phone-pad' | 'number-pad';

const onChangeTextCB = (
  text: string,
  onChangeText: $PropertyType<Props, 'onChangeText'>,
  mask: $PropertyType<Props, 'mask'>,
  unMask: $PropertyType<Props, 'unMask'>,
) => onChangeText(unMask ? unMask(mask(text)) : text);

export const CustomInput = (props: Props) => {
  const labelStyle = props.valid ? null : style.labelError;
  const value = props.mask && props.value ? props.mask(props.value) : props.value;

  return (
    <View>
      <Item floatingLabel error={!props.valid}>
        <Label style={labelStyle}>{props.label}</Label>
        <Input
          enablesReturnKeyAutomatically
          returnKeyType={'done'}
          keyboardType={props.keyboardType as KeyboardType}
          onChangeText={(text) =>
            onChangeTextCB(text, props.onChangeText, props.mask, props.unMask)
          }
          value={`${value || ''}`}
          onFocus={props.onFocus}
          maxLength={props.maxLength}
        />
      </Item>
      {!props.valid && <Text style={style.message}>{props.errorMessage}</Text>}
    </View>
  );
};
