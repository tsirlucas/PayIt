import * as React from 'react';
import {Scene} from 'react-native-router-flux';
import {NavbarComponent} from 'components/common/Layout';
import {BillsForm, PaydayForm, PendenciesList} from 'components/pages';

export const ApplicationModals = () => [
  <Scene
    key="payday-form-edit"
    path="/payday-form-edit"
    title="Payday"
    component={PaydayForm}
    hideNavBar
    hideTabBar
  />,
  <Scene
    dynamicTitle="type"
    key="pendencies-modal"
    path="pendencies-modal/:type"
    component={PendenciesList}
    navBar={NavbarComponent}
  />,
  <Scene
    key="bills-form"
    dynamicTitle="formType"
    path="bills-form/:formType"
    component={BillsForm}
    navBar={NavbarComponent}
  />,
];
