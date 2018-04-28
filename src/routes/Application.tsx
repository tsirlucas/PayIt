import * as React from 'react';
import {Platform} from 'react-native';
import {Modal, Scene, Stack} from 'react-native-router-flux';
import {Content} from 'native-base';

import {NavbarComponent, TabBarComponent} from 'components/common/Layout';
import {Bills, Home, Settings} from 'components/pages';

import {I18n} from '../i18n';
import {ApplicationModals} from './ApplicationModals';
import {MapDispatchToProps} from './Routes';

export const Application = (props: MapDispatchToProps) => (
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
          rightAction={{
            icon: Platform.select({ios: 'ios-log-out', android: 'md-log-out'}),
            action: props.actions.signOut,
          }}
        />
        <Scene
          key="bills"
          path="/bills"
          title={I18n.t('global.routes.titles.bills')}
          component={Bills}
          navBar={NavbarComponent}
          rightAction={{
            icon: Platform.select({ios: 'ios-add', android: 'md-add'}),
            action: props.actions.createBill,
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
      {ApplicationModals()}
    </Modal>
  </Stack>
);
