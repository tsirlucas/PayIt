import * as React from 'react';
import {Platform, ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Body, Button, List, ListItem, Text, Thumbnail} from 'native-base';
import {primaryColor} from 'style';
import {getFormattedMoney} from 'utils';

import {I18n} from './i18n';
import {
  MapDispatchToProps,
  mapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './PendenciesList.selectors';

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

type NavigatorProps = {type: 'delayed' | 'ideal' | 'next'};
type Props = MapStateToProps & MapDispatchToProps & NavigatorProps;

class PendenciesListComponent extends React.Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    const pendenciesToList = nextProps.pendencies[nextProps.type];

    if (pendenciesToList.length === 0) Actions.pop();
  }

  render() {
    if (this.props.pendencies === null) return <Text>Loading...</Text>;

    const pendenciesToList = this.props.pendencies[this.props.type];

    return (
      <List>
        <ScrollView>
          {pendenciesToList.map((pendency, index) => (
            <ListItem key={index}>
              <Thumbnail square size={80} source={imagesMap.default} />
              <Body>
                <Text>{pendency.description}</Text>
                <Text note>{`${I18n.t('pendenciesList.expirationDayLabel')}: ${I18n.strftime(
                  new Date(pendency.expirationDay),
                  '%d/%m/%Y',
                )}`}</Text>
                <Text note>{`${I18n.t('pendenciesList.valueLabel')}: ${getFormattedMoney(
                  pendency.value,
                )}`}</Text>
              </Body>
              <Button
                style={{alignSelf: 'center'}}
                transparent
                onPress={() => this.props.actions.payPendency(pendency.id)}
              >
                <Icon name={Platform.select({ios: "ios-checkmark-circle-outline", android: "md-checkbox-outline"})} size={34} color={primaryColor} style={{color: primaryColor}} />
              </Button>
            </ListItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const PendenciesList = connect(mapStateToProps, mapDispatchToProps)(PendenciesListComponent);
