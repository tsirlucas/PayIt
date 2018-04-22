declare module 'vanilla-masker' {
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

  type VMaskerType = {
    toMoney: (
      value: string,
      settings?: {
        precision?: number;
        separator?: string;
        delimiter?: string;
        unit?: string;
        suffixUnit?: string;
        zeroCents?: boolean;
      },
    ) => string;
  };
  const VMasker: VMaskerType;

  export = VMasker;
}
