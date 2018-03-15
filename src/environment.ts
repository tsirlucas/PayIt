import Config from 'react-native-config';

console.log(Config);
const commonvars = {
  googleAuth: {
    iosClientId: Config.IOS_CLIENT_ID,
    webClientId: Config.WEB_CLIENT_ID,
  },
};

export const environment = {
  currentType: process.env.NODE_ENV || 'development',
  settings: commonvars,
};
