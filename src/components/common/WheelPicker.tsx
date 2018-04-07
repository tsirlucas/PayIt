import * as React from 'react';
import {Picker, Platform, TextStyle, ViewStyle} from 'react-native';
import {WheelPicker as AndroidWheelPickerComponent} from 'react-native-wheel-picker-android';

const PickerItem = Picker.Item;

type Props = {
  style: ViewStyle;
  selectedValue: string;
  itemStyle: TextStyle;
  data: string[];
  onValueChange: (value: string) => void;
};

type AndroidCBItem = {
  position: number;
  data: string;
};

const AndroidWheelPicker = (props: Props) => (
  <AndroidWheelPickerComponent
    onItemSelected={(item: AndroidCBItem) => props.onValueChange(item.position.toString())}
    isCurved
    isAtmospheric
    data={props.data}
    style={{...props.style, marginTop: ((props.style.marginTop || 0) as number) + 50}}
    selectedItemTextColor={props.itemStyle.color || '#000000'}
  />
);

const IOSWheelPicker = (props: Props) => (
  <Picker
    style={props.style}
    selectedValue={parseInt(props.selectedValue, 10)}
    itemStyle={props.itemStyle}
    onValueChange={(i: number) => props.onValueChange(i.toString())}
  >
    {props.data.map((value: string, i: number) => (
      <PickerItem label={value} value={i} key={value} />
    ))}
  </Picker>
);

export const WheelPicker = Platform.select({
  ios: () => IOSWheelPicker,
  android: () => AndroidWheelPicker,
})();
