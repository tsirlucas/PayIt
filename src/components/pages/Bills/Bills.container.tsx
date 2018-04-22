import * as React from 'react';
import {Platform, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Body, Button, List, ListItem, Text, Thumbnail} from 'native-base';
import {colors} from 'style';
import {getFormattedMoney} from 'utils';

import {
  mapDispatchToProps,
  MapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './Bills.selectors';
import {I18n} from './i18n';

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

// const priorityBarColors: {[index: number]: string} = {
//   1: colors.info,
//   2: colors.danger,
//   3: colors.warning,
// };

type Props = MapStateToProps & MapDispatchToProps;

class BillsComponent extends React.Component<Props> {
  render() {
    if (this.props.bills === null) return <Text>Loading...</Text>;

    const billsArray = Object.values(this.props.bills);

    if (billsArray.length === 0) return <Text>Empty</Text>;

    return (
      <List>
        <ScrollView>
          {billsArray.map((bill, index) => (
            <ListItem key={index} onPress={() => this.props.actions.editBill(bill.id)}>
              <Thumbnail square size={80} source={imagesMap.default} />
              <Body>
                <Text>{bill.description}</Text>
                <Text note>{`${I18n.t('bills.expirationDayLabel')}: ${bill.expirationDay}`}</Text>
                <Text note>{`${I18n.t('bills.valueLabel')}: ${getFormattedMoney(
                  bill.value,
                )}`}</Text>
              </Body>
              <Button
                style={{alignSelf: 'center'}}
                transparent
                onPress={() => this.props.actions.deleteBill(bill.id)}
              >
                <Icon
                  name={Platform.select({
                    ios: 'ios-trash',
                    android: 'md-trash',
                  })}
                  size={34}
                  color={colors.danger}
                  style={{color: colors.danger}}
                />
              </Button>
              {/* <View
                style={[style.priorityBar, {backgroundColor: priorityBarColors[bill.priority]}]}
              /> */}
            </ListItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const Bills = connect(mapStateToProps, mapDispatchToProps)(BillsComponent);
