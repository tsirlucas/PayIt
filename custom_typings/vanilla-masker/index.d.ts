declare module 'vanilla-masker' {
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
