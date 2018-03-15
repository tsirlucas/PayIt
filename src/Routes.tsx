import * as React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Content} from 'native-base';
import {$call} from 'utility-types';

import {NavbarComponent, TabBarComponent} from 'components/common/Layout';
import {Bills, Home, Settings} from 'components/pages';
import {RootState} from 'core';
import {Login} from 'pages/Login';

const mapStateToProps = (state: RootState) => ({
  userUid: state.user.data.uid,
});

const mapStateToPropsNope = $call(mapStateToProps);
export type RoutesProps = typeof mapStateToPropsNope;

class Routes extends React.Component<RoutesProps> {
  render() {
    return (
      <Router sceneStyle={{backgroundColor: '#F5EEEE'}}>
        <Scene
          component={null}
          tabs
          key="tabs"
          tabBarPosition="bottom"
          contentComponent={Content}
          tabBarComponent={TabBarComponent}
          navBar={NavbarComponent}
          onEnter={() => this.checkAuth(this.props.userUid)}
        >
          <Scene key="login" path="/login" title="Login" component={Login} hideNavBar hideTabBar />

          <Scene key="home" path="/" title="Home" component={Home} />
          <Scene key="bills" path="/bills" title="Bills" component={Bills} />
          <Scene key="settings" path="/settings" title="Settings" component={Settings} />
        </Scene>
      </Router>
    );
  }

  checkAuth = (uid: string) => {
    if (!uid) {
      Actions.jump('login');
    }
  };
}

export default connect(mapStateToProps)(Routes);
