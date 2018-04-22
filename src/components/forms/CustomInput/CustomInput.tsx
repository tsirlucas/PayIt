import * as React from 'react';
import {Text, View} from 'react-native';
import {Input, Item, Label} from 'native-base';

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

export const CustomInput = (props: Props) => {
  return (
    <View>
      <Item floatingLabel error={!props.valid}>
        <Label style={props.valid ? null : style.labelError}>{props.label}</Label>
        <Input
          enablesReturnKeyAutomatically
          returnKeyType={'done'}
          keyboardType={props.keyboardType as KeyboardType}
          onChangeText={(text) =>
            props.onChangeText(props.unMask ? props.unMask(props.mask(text)) : text)
          }
          value={`${props.mask && props.value ? props.mask(props.value) : props.value || ''}`}
          onFocus={props.onFocus}
          maxLength={props.maxLength}
        />
      </Item>
      {!props.valid && <Text style={style.message}>{props.errorMessage}</Text>}
    </View>
  );
};
