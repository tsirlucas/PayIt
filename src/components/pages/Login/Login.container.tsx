import * as React from 'react';
import {Image} from 'react-native';
import {connect} from 'react-redux';
import {Button, Icon as NBIcon, Text, View} from 'native-base';

import {SentryService} from 'services';

import {Balloon} from '../Home/components';
import {I18n} from './i18n';
import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Login.selectors';
import {style} from './Login.style';

export type LoginProps = MapDispatchToProps & MapStateToProps;

const images = {
  wavingMan: require('assets/img/login.png'),
};

class LoginComponent extends React.Component<LoginProps> {
  onPress = () => {
    SentryService.getInstance().captureException(new Error('in onPress function'));
    this.props.actions.signIn();
  };
  render() {
    return (
      <View style={style.container}>
        <View style={style.content}>
          <Balloon text={I18n.t('login.greeting')} />
          <Image style={style.avatar} source={images.wavingMan} />
          <Button iconLeft danger onPressIn={this.onPress} style={style.buttons}>
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
