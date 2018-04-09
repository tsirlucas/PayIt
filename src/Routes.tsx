import * as React from 'react';
import {Router, Scene, Stack} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Content} from 'native-base';
import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {ActivityIndicator} from 'components/common/ActivityIndicator';
import {NavbarComponent, TabBarComponent} from 'components/common/Layout';
import {PaydayForm} from 'components/forms/PaydayForm';
import {Bills, Home, Settings} from 'components/pages';
import {RootState} from 'core';
import {actions as userActions} from 'core/user';
import {Login} from 'pages/Login';

const mapStateToProps = (state: RootState) => ({
  userUid: state.user.data.uid,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({checkAuth: userActions.checkAuth}, dispatch),
});

export type RoutesProps = $Call<typeof mapStateToProps> & $Call<typeof mapDispatchToProps>;

class Routes extends React.Component<RoutesProps> {
  componentWillMount() {
    this.props.actions.checkAuth();
  }

  render() {
    return [
      <ActivityIndicator key="activity-indicator" />,
      <Router key="router" sceneStyle={{backgroundColor: '#F5EEEE'}}>
        <Scene key="root" hideNavBar component={undefined}>
          <Stack key="authentication" hideNavBar>
            <Scene
              key="login"
              path="/login"
              title="Login"
              component={Login}
              hideNavBar
              hideTabBar
              initial
            />
            <Scene
              key="payday-form"
              path="/payday-form"
              title="Payday"
              component={PaydayForm}
              hideNavBar
              hideTabBar
            />
          </Stack>
          <Stack key="application" hideNavBar>
            <Scene
              component={undefined}
              tabs
              key="tabs"
              tabBarPosition="bottom"
              contentComponent={Content}
              tabBarComponent={TabBarComponent}
              navBar={NavbarComponent}
            >
              <Scene key="home" path="/" title="Home" component={Home} />
              <Scene key="bills" path="/bills" title="Bills" component={Bills} />
              <Scene key="settings" path="/settings" title="Settings" component={Settings} />
            </Scene>
          </Stack>
        </Scene>
      </Router>,
    ];
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
