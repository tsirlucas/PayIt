import * as React from 'react';
import prompt from 'react-native-prompt-android';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {I18n} from './i18n';
import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Settings.selectors';
import {SettingsView} from './Settings.view';

export type SettingsProps = MapStateToProps & MapDispatchToProps;

class SettingsComponent extends React.Component<SettingsProps> {
  changeName = () => {
    prompt(
      I18n.t('settings.personal.name.formTitle'),
      I18n.t('settings.personal.name.formMessage'),
      [
        {text: I18n.t('global.confirmDialog.cancel'), style: 'cancel'},
        {
          text: I18n.t('global.confirmDialog.confirm'),
          onPress: (name) => (name ? this.props.actions.changeUserName(name) : null),
        },
      ],
      {
        cancelable: true,
        defaultValue: this.props.user.displayName,
      },
    );
  };

  changePayday = () => {
    Actions.push('payday-form-edit', {edit: true});
  };

  render() {
    return <SettingsView {...this.props} changeName={this.changeName} changePayday={this.changePayday}/>;
  }
}

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);
export const UnconnectedSettings = SettingsComponent;
