import {PixelRatio, StyleSheet} from 'react-native';
import {primaryColor} from 'style';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: 60,
  },
  confirmButton: {
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: primaryColor,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
