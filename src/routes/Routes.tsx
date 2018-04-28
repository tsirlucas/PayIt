import * as React from 'react';
import {StatusBar} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {ActivityIndicator} from 'components/common/ActivityIndicator';
import {Backdrop} from 'components/common/Backdrop';
import {RootState} from 'core';
import {actions as billActions} from 'core/bills';
import {actions as globalActions} from 'core/global';
import {actions as userActions} from 'core/user';
import {primaryColor} from 'src/style';

import {Application} from './Application';
import {Authentication} from './Authentication';

const mapStateToProps = (state: RootState) => ({
  userUid: state.user.data.uid,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators(
    {
      initApplication: globalActions.initApplication,
      createBill: billActions.newBill,
      signOut: userActions.signOut,
    },
    dispatch,
  ),
});

type MapStateToProps = $Call<typeof mapStateToProps>;
export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;

export type RoutesProps = MapStateToProps & MapDispatchToProps;

class RoutesComponent extends React.Component<RoutesProps> {
  componentWillMount() {
    this.props.actions.initApplication();
  }

  render() {
    return [
      <StatusBar key="status-bar" backgroundColor={primaryColor} barStyle="light-content" />,
      <Router key="router" sceneStyle={{backgroundColor: '#F5EEEE'}}>
        <Scene key="root" hideNavBar component={undefined}>
          {Authentication()}
          {Application({actions: this.props.actions})}
        </Scene>
      </Router>,
      <ActivityIndicator key="activity-indicator" />,
      <Backdrop key="root-backdrop" />,
    ];
  }
}

export const Routes = connect(mapStateToProps, mapDispatchToProps)(RoutesComponent);
