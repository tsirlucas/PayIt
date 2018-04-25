import * as React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {Actions, SceneProps} from 'react-native-router-flux';
import {Body, Button, Footer, FooterTab, Header, Icon, Left, Right, Title} from 'native-base';
import {primaryColor} from 'style';

import {I18n} from 'src/i18n';

type RoutesTypes = {
  [index: string]: string;
};

const titles: RoutesTypes = {
  home: I18n.t('global.routes.titles.home'),
  bills: I18n.t('global.routes.titles.bills'),
  settings: I18n.t('global.routes.titles.settings'),
};

const icons: RoutesTypes = {
  home: 'home',
  bills: 'paper',
  settings: 'settings',
};

export const NavbarComponent = (props: SceneProps) => (
  <View accessibilityLabel="nav bar">
    <Header style={{backgroundColor: primaryColor}}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      <Left>
        {props.scene.index > 0 && (
          <Button transparent onPress={Actions.pop}>
            <Icon name="arrow-back" color="white" style={{color: 'white'}} />
          </Button>
        )}
      </Left>

      <Body>
        <View accessibilityLabel={`${props.title} title`}>
          <Title style={{color: 'white'}}>
            {props.title || I18n.t(`global.routes.titles.${props[props.dynamicTitle]}`)}
          </Title>
        </View>
      </Body>
      {props.rightAction ? (
        <Right>
          <Button transparent onPress={() => props.rightAction.action()}>
            <Text style={{color: 'white'}}>
              {I18n.t(`global.routes.actions.${props.rightAction.text}`)}
            </Text>
          </Button>
        </Right>
      ) : (
        <Right />
      )}
    </Header>
  </View>
);

export const TabBarComponent = (props: SceneProps) => (
  <View accessibilityLabel="tab bar">
    <Footer>
      <FooterTab style={{backgroundColor: primaryColor}}>
        {props.navigationState.routes.map((item: {key: string}, index: number) => {
          const active = props.navigationState.index === index;
          return (
            <Button
              key={index}
              vertical
              onPress={() => Actions.jump(item.key)}
              accessibilityLabel={`${item.key} button`}
            >
              <Icon name={icons[item.key]} style={{color: 'white'}} active={active} />
              {active && <Text style={{color: 'white'}}>{titles[item.key]}</Text>}
            </Button>
          );
        })}
      </FooterTab>
    </Footer>
  </View>
);
