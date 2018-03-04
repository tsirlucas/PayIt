import * as React from 'react';
import { Text, StatusBar } from 'react-native';
import { Actions, SceneProps } from 'react-native-router-flux';
import { Header, Body, Title, Footer, FooterTab, Button, Icon } from 'native-base';

type RoutesTypes = {
  [index: string]: string;
};

const titles: RoutesTypes = {
  home: 'Home',
  bills: 'Bills',
  settings: 'Settings',
};

const icons: RoutesTypes = {
  home: 'home',
  bills: 'calendar',
  settings: 'settings',
};

export const NavbarComponent = (props: SceneProps) => (
  <Header style={{ backgroundColor: '#5FB97D' }}>
    <StatusBar backgroundColor='#30925C' barStyle='light-content' />
    <Body>
      <Title>{props.title}</Title>
    </Body>
  </Header>
);

export const TabBarComponent = (props: SceneProps) => (
  <Footer>
    <FooterTab style={{ backgroundColor: '#5FB97D' }}>
      {props.navigationState.routes.map((item: { key: string }, index: number) =>
        (<Button key={index} vertical onPress={() => Actions.jump(item.key)}>
          <Icon name={icons[item.key]} style={{ color: 'white' }} />
          <Text style={{ color: 'white' }}>{titles[item.key]}</Text>
        </Button>))}
    </FooterTab>
  </Footer>
);
