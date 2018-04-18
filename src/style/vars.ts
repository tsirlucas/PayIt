import {Platform} from 'react-native';

export const primaryColor = Platform.select({android: '#36AE81', ios: '#5FB97D'});
export const colors = {
  info: '#62B1F6',
  warning: '#f0ad4e',
  danger: '#d9534f',
  success: '#5cb85c',
};
