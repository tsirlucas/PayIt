import * as React from 'react';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Body, List, ListItem, Text, Thumbnail} from 'native-base';
import {colors} from 'style/vars';
import {getFormattedMoney} from 'utils';

import {MapStateToProps, mapStateToProps} from './Bills.selectors';
import {style} from './Bills.style';
import {I18n} from './i18n';

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

const priorityBarColors: {[index: number]: string} = {
  1: colors.info,
  2: colors.danger,
  3: colors.warning,
};

class BillsComponent extends React.Component<MapStateToProps> {
  render() {
    if (this.props.bills === null) return <Text>Loading...</Text>;

    const billsArray = Object.values(this.props.bills);

    if (billsArray.length === 0) return <Text>Empty</Text>;

    return (
      <List>
        <ScrollView>
          {billsArray.map((bill, index) => (
            <ListItem key={index}>
              <Thumbnail square size={80} source={imagesMap.default} />
              <Body>
                <Text>{bill.description}</Text>
                <Text note>{`${I18n.t('bills.expirationDayLabel')}: ${bill.expirationDay}`}</Text>
                <Text note>{`${I18n.t('bills.valueLabel')}: ${getFormattedMoney(
                  bill.value,
                )}`}</Text>
              </Body>
              <View
                style={[style.priorityBar, {backgroundColor: priorityBarColors[bill.priority]}]}
              />
            </ListItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const Bills = connect(mapStateToProps)(BillsComponent);
