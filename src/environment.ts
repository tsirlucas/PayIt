import {IOS_CLIENT_ID, WEB_CLIENT_ID} from 'react-native-dotenv';

const commonvars = {
  googleAuth: {
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  },
};

export const environment = {
  settings: commonvars,
};
