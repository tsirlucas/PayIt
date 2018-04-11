import {Platform, StyleSheet} from 'react-native';
import {zIndexWorkaround} from 'utils';

const measurements = Platform.select({
  ios: () => ({
    marginRight: -16,
    marginTop: -13,
    marginBottom: -13,
    height: 82.5,
  }),
  android: () => ({
    marginRight: -18,
    marginTop: -15,
    marginBottom: -15,
    height: 90,
  }),
});

export const style = StyleSheet.create({
  priorityBar: {
    width: 4,
    ...measurements(),
  },
});
