import * as React from 'react';
import { Text, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Header, Body, Title, Footer, FooterTab, Button, Icon } from 'native-base';

const titles = {
  home: 'Home',
  bills: 'Bills',
  settings: 'Settings',
};

const icons = {
  home: 'home',
  bills: 'calendar',
  settings: 'settings',
};

export const NavbarComponent = (props) => (
  <Header style={{ backgroundColor: '#5FB97D' }}>
    <StatusBar backgroundColor='#30925C' barStyle='light-content' />
    <Body>
      <Title>{props.title}</Title>
    </Body>
  </Header>
);

export const TabBarComponent = (props) => {
  console.log(props, 'oi');
  return (
    <Footer>
      <FooterTab style={{ backgroundColor: '#5FB97D' }}>
        {props.navigationState.routes.map((item, index) =>
          (<Button key={index} vertical onPress={() => Actions.jump(item.key)}>
            <Icon name={icons[item.key]} style={{ color: 'white' }} />
            <Text style={{ color: 'white' }}>{titles[item.key]}</Text>
          </Button>))}
      </FooterTab>
    </Footer>
  );
};
