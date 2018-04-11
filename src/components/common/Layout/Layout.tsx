import * as React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {Actions, SceneProps} from 'react-native-router-flux';
import {Body, Button, Footer, FooterTab, Header, Icon, Title} from 'native-base';
import {primaryColor} from 'style';

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
  <View accessibilityLabel="nav bar">
    <Header style={{backgroundColor: primaryColor}}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      <Body>
        <View accessibilityLabel={`${props.title} title`}>
          <Title style={{color: 'white'}}>{props.title}</Title>
        </View>
      </Body>
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
