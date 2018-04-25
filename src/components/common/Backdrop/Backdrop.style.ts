import {StyleSheet, ViewStyle} from 'react-native';
import {zIndexWorkaround} from 'utils';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ...zIndexWorkaround(20),
  } as ViewStyle,
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  } as ViewStyle,
});
