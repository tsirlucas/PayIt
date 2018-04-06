import {Platform} from 'react-native';

export function zIndexWorkaround(val: number): Object {
  return Platform.select({
    ios: {zIndex: val},
    android: {elevation: val},
  });
}
