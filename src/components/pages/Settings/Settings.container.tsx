import * as React from 'react';
import {Platform, View} from 'react-native';
import prompt from 'react-native-prompt-android';
import {Actions} from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Body, Container, Content, Icon, Left, List, ListItem, Right, Text} from 'native-base';

import {I18n} from './i18n';
import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Settings.selectors';
import {style} from './Settings.style';

type Props = MapStateToProps & MapDispatchToProps;

class SettingsComponent extends React.Component<Props> {
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
    return (
      <Container>
        <Content>
          <Text style={style.listSeparator}>{I18n.t('settings.personal.label')}</Text>

          <List style={style.list}>
            <ListItem icon onPress={this.changeName}>
              <Left>
                <View style={{width: 25.7, alignItems: 'center'}}>
                  <Ionicons
                    name={Platform.select({ios: 'ios-person-outline', android: 'md-person'})}
                    size={Platform.select({ios: 30, android: 24})}
                  />
                </View>
              </Left>
              <Body>
                <Text>{I18n.t('settings.personal.name.label')}</Text>
              </Body>
              <Right>
                <Text>{this.props.user.displayName}</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <View style={{width: 25.7, alignItems: 'center'}}>
                  <Ionicons
                    name={Platform.select({ios: 'ios-mail-outline', android: 'md-mail'})}
                    size={Platform.select({ios: 30, android: 24})}
                  />
                </View>
              </Left>
              <Body>
                <Text>{I18n.t('settings.personal.email.label')}</Text>
              </Body>
              <Right>
                <Text>{this.props.user.email}</Text>
                {/* <Icon name="arrow-forward" /> */}
              </Right>
            </ListItem>
          </List>

          <Text style={style.listSeparator}>{I18n.t('settings.financial.label')}</Text>
          <List style={style.list}>
            <ListItem icon onPress={this.changePayday}>
              <Left>
                <View style={{width: 25.7, alignItems: 'center'}}>
                  <Ionicons
                    name={Platform.select({ios: 'ios-calendar-outline', android: 'md-calendar'})}
                    size={Platform.select({ios: 30, android: 28})}
                  />
                </View>
              </Left>
              <Body>
                <Text>{I18n.t('settings.financial.payday')}</Text>
              </Body>
              <Right>
                <Text>{this.props.user.payday}</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);
