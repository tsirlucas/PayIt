import * as React from 'react';
import {Image, View} from 'react-native';
import {connect} from 'react-redux';
import {Container, List, ListItem, Text} from 'native-base';

import {Pendency} from 'models';

import {Balloon} from './components';
import {MapStateToProps, mapStateToProps} from './Home.selectors';
import {style} from './Home.style';
import {I18n} from './i18n';

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
    if (!this.hasPendencies)
      return I18n.t('home.greetingNoPendencies', {name: this.props.userName});
    return I18n.t('home.greeting', {name: this.props.userName});
  };

  hasPendencies = () => {
    const {delayed, ideal, next} = this.props.pendencies;
    return delayed.length > 0 || ideal.length > 0 || next.length > 0;
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
        {this.hasPendencies() ? <PendenciesList data={this.getDataArray()} /> : <NoPendencies />}
      </Container>
    );
  }
}

const NoPendencies = () => (
  <View style={style.noPendenciesView}>
    <View style={style.noPendenciesSubView}>
      <View style={style.noPendencies}>
        <Text style={[style.bigFont, style.greenFont, {textAlign: 'center'}]}>
          {I18n.t('home.noPendencies')}
        </Text>
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
          {I18n.t(`home.label.${item.title}`, {count: item.data.length})}
        </Text>
      </ListItem>
    )}
  />
);

export const Home = connect(mapStateToProps)(HomeComponent);
