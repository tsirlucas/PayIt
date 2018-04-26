import {Dimensions} from 'react-native';

export const isSmallDevice = () => Dimensions.get('window').height <= 580;
