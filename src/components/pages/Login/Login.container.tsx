import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {Button, Icon as NBIcon, Text, View} from 'native-base';

import {I18n} from './i18n';
import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Login.selectors';
import {style} from './Login.style';

export type LoginProps = MapDispatchToProps & MapStateToProps;

class LoginComponent extends React.Component<LoginProps> {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={style.content}>
          <Text style={style.header}>{I18n.t('login.greeting')}</Text>
          <View style={style.avatar}>
            <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
          </View>
          <Text style={style.text}>{I18n.t('login.label')}</Text>
          <Button iconLeft danger onPress={this.props.actions.signIn}>
            <NBIcon name="logo-google" />
            <Text>{I18n.t('login.googleLogin')}</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export const UnconnectedLogin = LoginComponent;
