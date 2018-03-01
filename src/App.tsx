import * as React from 'react';
import {Text, StatusBar} from 'react-native';
import {Header, Body, Title, Container, Content, Footer, FooterTab, Button, Icon} from 'native-base';

export default class App extends React.Component {
  render() {
    return (
      <Container style={{backgroundColor: '#F5EEEE'}}>
        <Header style={{backgroundColor: '#5FB97D'}}>
          <StatusBar backgroundColor="#30925C" barStyle="light-content"/>
          <Body>
          <Title>Title</Title>
          </Body>
        </Header>
        <Content>
          <Text>{getMessage('Hello world!')}</Text>
        </Content>
        <Footer>
          <FooterTab style={{backgroundColor: '#5FB97D'}}>
            <Button vertical>
              <Icon name="home" style={{color: 'white'}}/>
              <Text style={{color: 'white'}}>Dashboard</Text>
            </Button>
            <Button vertical>
              <Icon name="calendar" style={{color: 'white'}}/>
              <Text style={{color: 'white'}}>Bills</Text>
            </Button>
            <Button vertical>
              <Icon name="settings" style={{color: 'white'}}/>
              <Text style={{color: 'white'}}>Settings</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const getMessage = (message: string): string => {
  return message;
};
