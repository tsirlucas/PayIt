import * as React from 'react';
import {Platform, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Body, Container, Content, Left, List, ListItem, Right, Text} from 'native-base';

import {I18n} from './i18n';
import {mapStateToProps, MapStateToProps} from './Settings.selectors';
import {style} from './Settings.style';

class SettingsComponent extends React.Component<MapStateToProps> {
  render() {
    return (
      <Container>
        <Content>
          <Text style={style.listSeparator}>{I18n.t('settings.personal.label')}</Text>

          <List style={style.list}>
            <ListItem icon>
              <Left>
                <View style={{width: 25.7, alignItems: 'center'}}>
                  <Ionicons
                    name={Platform.select({ios: 'ios-person-outline', android: 'md-person'})}
                    size={Platform.select({ios: 30, android: 24})}
                  />
                </View>
              </Left>
              <Body>
                <Text>{I18n.t('settings.personal.name')}</Text>
              </Body>
              <Right>
                <Text>{this.props.user.displayName}</Text>
                {/* <Icon name="arrow-forward" /> */}
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
                <Text>{I18n.t('settings.personal.email')}</Text>
              </Body>
              <Right>
                <Text>{this.props.user.email}</Text>
                {/* <Icon name="arrow-forward" /> */}
              </Right>
            </ListItem>
          </List>

          <Text style={style.listSeparator}>{I18n.t('settings.financial.label')}</Text>
          <List style={style.list}>
            <ListItem icon>
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
                {/* <Icon name="arrow-forward" /> */}
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const Settings = connect(mapStateToProps)(SettingsComponent);
