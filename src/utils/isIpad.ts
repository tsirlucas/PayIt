import {Dimensions} from 'react-native';

export const isIpad = () => {
  const {height, width} = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio <= 1.6;
};
