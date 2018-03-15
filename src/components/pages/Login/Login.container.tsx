import * as React from 'react';
import {GoogleSigninButton} from 'react-native-google-signin';
import {connect} from 'react-redux';
import {View} from 'native-base';

import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Login.selectors';

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
        <GoogleSigninButton
          style={{width: 120, height: 44}}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.props.actions.signIn}
        />
      </View>
    );
  }
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
