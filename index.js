import {AppRegistry} from 'react-native';

import App from './src/App';
import {SentryService} from './src/services';

SentryService.getInstance().config();

AppRegistry.registerComponent('PayIt', () => App);
