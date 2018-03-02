import * as React from 'react';
import { Content } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';

import { Home, Bills, Settings } from './components/pages';
import { TabBarComponent, NavbarComponent } from './components/common/Layout';

export default class App extends React.Component {
  render() {
    return (
      <Router sceneStyle={{ backgroundColor: '#F5EEEE' }}>
        <Scene component={null} tabs key='tabs' tabBarPosition='bottom'
          contentComponent={Content} tabBarComponent={TabBarComponent} navBar={NavbarComponent}>
          <Scene key='home' path='/' title='Home' component={Home} />
          <Scene key='bills' path='/bills' title='Bills' component={Bills} />
          <Scene key='settings' path='/settings' title='Settings' component={Settings} />
        </Scene>
      </Router>
    );
  }
}
