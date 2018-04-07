declare module 'react-native-wheel-picker-android' {
  import {ComponentType, ViewStyle} from 'react';

  type Props = {
    style?: ViewStyle;
    onItemSelected: (_: any) => void;
    data: Array<any>;
    isCurved?: boolean;
    isCyclic?: boolean;
    isAtmospheric?: boolean;
    selectedItemTextColor?: string;
    itemSpace?: number;
    visibleItemCount?: number;
    renderIndicator?: boolean;
    indicatorColor?: string;
    isCurtain?: boolean;
    curtainColor?: string;
    itemTextColor?: string;
    itemTextSize?: number;
    itemTextFontFamily?: string;
    selectedItemPosition?: number;
    backgroundColor?: string;
  };

  type WheelPickerType = ComponentType<Props>;
  const WheelPicker: WheelPickerType;

  const module = {
    WheelPicker,
  };

  export = module;
}
