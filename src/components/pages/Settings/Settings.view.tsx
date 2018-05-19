import * as React from 'react';
import {Platform, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Body, Container, Content, Icon, Left, List, ListItem, Right, Text} from 'native-base';
import {$PropertyType} from 'utility-types';

import {I18n} from './i18n';
import {SettingsProps} from './Settings.container';
import {style} from './Settings.style';

type ViewProps = {
  changeName: () => void;
  changePayday: () => void;
};

type ListItemProps = {
  icon: string;
  iconSize: number;
  label: string;
  text: string | number;
  onPress?: $PropertyType<Props, 'changeName'>;
};

type Props = SettingsProps & ViewProps;

export const SettingsView = (props: Props) => (
  <Container>
    <Content>
      <Text style={style.listSeparator}>{I18n.t('settings.personal.label')}</Text>

      <List style={style.list}>
        <ListItemComp
          onPress={props.changeName}
          icon={Platform.select({ios: 'ios-person-outline', android: 'md-person'})}
          iconSize={Platform.select({ios: 30, android: 24})}
          label={I18n.t('settings.personal.name.label')}
          text={props.user.displayName}
        />
        <ListItemComp
          icon={Platform.select({ios: 'ios-mail-outline', android: 'md-mail'})}
          iconSize={Platform.select({ios: 30, android: 24})}
          label={I18n.t('settings.personal.email.label')}
          text={props.user.email}
        />
      </List>

      <Text style={style.listSeparator}>{I18n.t('settings.financial.label')}</Text>
      <List style={style.list}>
        <ListItemComp
          onPress={props.changePayday}
          icon={Platform.select({ios: 'ios-calendar-outline', android: 'md-calendar'})}
          iconSize={Platform.select({ios: 30, android: 28})}
          label={I18n.t('settings.financial.payday')}
          text={props.user.payday}
        />
      </List>
    </Content>
  </Container>
);

const ListItemComp = (props: ListItemProps) => (
  <ListItem icon onPress={props.onPress}>
    <Left>
      <View style={{width: 25.7, alignItems: 'center'}}>
        <Ionicons name={props.icon} size={props.iconSize} />
      </View>
    </Left>
    <Body>
      <Text>{props.label}</Text>
    </Body>
    <Right style={{maxWidth: 200}}>
      <Text numberOfLines={1}>{props.text}</Text>
      {props.onPress && <Icon name="arrow-forward" />}
    </Right>
  </ListItem>
);
