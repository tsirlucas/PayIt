declare module 'react-native-picker-select' {
  import {ComponentType} from 'react';

  type Props = {
    onValueChange: (value: number | string, index: number) => void;
    items: {label: string; value: string | number; key?: string}[];
    placeholder?: Object;
    disabled?: boolean;
    value?: number | string;
    style?: Object;
    hideDoneBar?: boolean;
    hideIcon?: boolean;
    onUpArrow?: Function;
    onDownArrow?: Function;
  };

  type PickerType = ComponentType<Props>;
  const Picker: PickerType;

  export = Picker;
}
