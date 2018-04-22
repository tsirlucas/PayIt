import * as React from 'react';
import {Modal, Router, Scene, Stack} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Content} from 'native-base';
import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {ActivityIndicator} from 'components/common/ActivityIndicator';
import {NavbarComponent, TabBarComponent} from 'components/common/Layout';
import {PaydayForm} from 'components/forms/PaydayForm';
import {Bills, BillsForm, Home, PendenciesList, Settings} from 'components/pages';
import {RootState} from 'core';
import {actions as billActions} from 'core/bills';
import {actions as globalActions} from 'core/global';
import {Login} from 'pages/Login';

import {I18n} from './i18n';

const mapStateToProps = (state: RootState) => ({
  userUid: state.user.data.uid,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators(
    {initApplication: globalActions.initApplication, createBill: billActions.newBill},
    dispatch,
  ),
});

export type RoutesProps = $Call<typeof mapStateToProps> & $Call<typeof mapDispatchToProps>;

class Routes extends React.Component<RoutesProps> {
  componentWillMount() {
    this.props.actions.initApplication();
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
            <Modal key="modal" component={undefined}>
              <Scene
                component={undefined}
                tabs
                key="tabs"
                tabBarPosition="bottom"
                contentComponent={Content}
                tabBarComponent={TabBarComponent}
                hideNavBar
              >
                <Scene
                  key="home"
                  path="/"
                  title={I18n.t('global.routes.titles.home')}
                  component={Home}
                  navBar={NavbarComponent}
                />
                <Scene
                  key="bills"
                  path="/bills"
                  title={I18n.t('global.routes.titles.bills')}
                  component={Bills}
                  navBar={NavbarComponent}
                  rightAction={{
                    text: 'create',
                    action: this.props.actions.createBill,
                  }}
                />
                <Scene
                  key="settings"
                  path="/settings"
                  title={I18n.t('global.routes.titles.settings')}
                  component={Settings}
                  navBar={NavbarComponent}
                />
              </Scene>
              <Scene
                dynamicTitle="type"
                key="pendencies-modal"
                path="pendencies-modal/:type"
                component={PendenciesList}
                navBar={NavbarComponent}
              />
              <Scene
                key="bills-form"
                dynamicTitle="formType"
                path="bills-form/:formType"
                component={BillsForm}
                navBar={NavbarComponent}
              />
            </Modal>
          </Stack>
        </Scene>
      </Router>,
    ];
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
