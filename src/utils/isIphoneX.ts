import {Dimensions, Platform} from 'react-native';

const {height} = Dimensions.get('window');

export const isIphoneX = Platform.OS === 'ios' && height === 812;
