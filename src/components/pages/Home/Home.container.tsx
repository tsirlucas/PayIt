import * as React from 'react';
import {Image, View} from 'react-native';
import {connect} from 'react-redux';
import {Container, List, ListItem, Text} from 'native-base';

import {Pendency} from 'models';

import {Balloon} from './components';
import {MapStateToProps, mapStateToProps} from './Home.selectors';
import {style} from './Home.style';

const images = {
  wavingMan: require('../../../assets/img/home.png'),
};

type ArrayData = {title: string; data: Pendency[]}[];

class HomeComponent extends React.Component<MapStateToProps> {
  getDataArray = () => {
    const {delayed, ideal, next} = this.props.pendencies;
    const data = [
      {title: 'delayed', data: delayed},
      {title: 'ideal', data: ideal},
      {title: 'next', data: next},
    ];
    return data.filter((item) => item.data.length > 0);
  };

  getGreetingText = () => {
    return `Hello ${this.props.userName}, you have`;
  };

  render() {
    const {pendencies} = this.props;
    if (pendencies === null) return <Text>Loading...</Text>;
    return (
      <Container style={style.container}>
        <View>
          <Balloon text={this.getGreetingText()} />
          <Image style={style.image} source={images.wavingMan} />
        </View>
        {Object.keys(pendencies).length > 0 ? (
          <PendenciesList data={this.getDataArray()} />
        ) : (
          <NoPendencies />
        )}
      </Container>
    );
  }
}

const NoPendencies = () => (
  <View style={style.noPendenciesView}>
    <View style={style.noPendenciesSubView}>
      <View style={style.noPendencies}>
        <Text style={[style.bigFont, style.greenFont, {textAlign: 'center'}]}>No pendencies!</Text>
      </View>
    </View>
  </View>
);

const PendenciesList = (props: {data: ArrayData}) => (
  <List
    style={style.list}
    contentContainerStyle={style.listContent}
    dataArray={props.data}
    horizontal={true}
    renderRow={(item) => (
      <ListItem style={style.listItem}>
        <Text style={[style.bigFont, style[item.title], {textAlign: 'center'}]}>
          {item.data.length}
          {'\n'}
          {item.title.charAt(0).toUpperCase() + item.title.slice(1)} Bills
        </Text>
      </ListItem>
    )}
  />
);

export const Home = connect(mapStateToProps)(HomeComponent);
