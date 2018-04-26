import * as React from 'react';
import {Image, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import {Card, Container, List, Text} from 'native-base';

import {Loading} from 'components/common';
import {Pendency} from 'models';

import {Balloon} from './components';
import {
  MapDispatchToProps,
  mapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './Home.selectors';
import {style} from './Home.style';
import {I18n} from './i18n';

const images = {
  wavingMan: require('assets/img/home.png'),
};

type ArrayData = {title: string; data: Pendency[]}[];

class HomeComponent extends React.Component<MapStateToProps & MapDispatchToProps> {
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
    if (!this.hasPendencies())
      return I18n.t('home.greetingNoPendencies', {name: this.props.userName});
    return I18n.t('home.greeting', {name: this.props.userName});
  };

  hasPendencies = () => {
    const {delayed, ideal, next} = this.props.pendencies;
    return delayed.length > 0 || ideal.length > 0 || next.length > 0;
  };

  render() {
    const {pendencies} = this.props;

    if (pendencies === null) return <Loading />;

    return (
      <Container style={style.container}>
        <Balloon text={this.getGreetingText()} />
        <Image style={style.image} source={images.wavingMan} />
        {this.hasPendencies() ? (
          <PendenciesList
            data={this.getDataArray()}
            openPendenciesModal={this.props.actions.openPendenciesModal}
          />
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
        <Text style={[style.bigFont, style.greenFont, {textAlign: 'center'}]}>
          {I18n.t('home.noPendencies')}
        </Text>
      </View>
    </View>
  </View>
);

const PendenciesList = (props: {data: ArrayData; openPendenciesModal: Function}) => (
  <List
    style={style.list}
    contentContainerStyle={style.listContent}
    dataArray={props.data}
    horizontal={true}
    renderRow={(item) => (
      <TouchableWithoutFeedback onPress={() => props.openPendenciesModal(item.title)}>
        <Card style={style.listItem}>
          <Text style={[style.bigFont, style[item.title], {textAlign: 'center'}]}>
            {item.data.length}
            {'\n'}
            {I18n.t(`home.label.${item.title}`, {count: item.data.length})}
          </Text>
        </Card>
      </TouchableWithoutFeedback>
    )}
  />
);

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
export const UnconnectedHome = HomeComponent;
