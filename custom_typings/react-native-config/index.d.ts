declare module 'react-native-config' {
  export interface NativeConfig {
    [name: string]: any;
  }
  export const Config: NativeConfig;
  export default Config;
}
