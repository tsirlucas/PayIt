import * as React from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Body, List, ListItem, Text, Thumbnail} from 'native-base';
import {getFormattedMoney} from 'utils';

import {I18n} from './i18n';
import {MapStateToProps, mapStateToProps} from './PendenciesList.selectors';

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

class PendenciesListComponent extends React.Component<MapStateToProps> {
  render() {
    if (this.props.pendencies === null) return <Text>Loading...</Text>;

    const pendenciesToList = this.props.pendencies[this.props.type];

    if (pendenciesToList.length === 0) return <Text>Empty</Text>;

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
            </ListItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const PendenciesList = connect(mapStateToProps)(PendenciesListComponent);
