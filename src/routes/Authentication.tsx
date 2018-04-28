import * as React from 'react';
import {Scene, Stack} from 'react-native-router-flux';
import {Login, PaydayForm} from 'components/pages';

export const Authentication = () => (
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
);
