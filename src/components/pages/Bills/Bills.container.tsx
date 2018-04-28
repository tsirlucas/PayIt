import * as React from 'react';
import {Alert, Platform, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {List, Text} from 'native-base';
import {colors} from 'style';
import {getFormattedMoney} from 'utils';

import {Loading} from 'components/common';
import {BillsItem} from 'components/common/BillsList';

import {
  mapDispatchToProps,
  MapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './Bills.selectors';
import {EmptyBills} from './components/';
import {I18n} from './i18n';

type Props = MapStateToProps & MapDispatchToProps;

class BillsComponent extends React.Component<Props> {
  deleteBill = (billId: string) => {
    Alert.alert(I18n.t('global.confirmDialog.title'), I18n.t('global.confirmDialog.msg'), [
      {text: I18n.t('global.confirmDialog.cancel'), style: 'cancel'},
      {
        text: I18n.t('global.confirmDialog.confirm'),
        onPress: () => this.props.actions.deleteBill(billId),
      },
    ]);
  };

  render() {
    if (this.props.bills === null) return <Loading />;

    const billsArray = Object.values(this.props.bills);

    if (billsArray.length === 0) return <EmptyBills />;

    return (
      <List>
        <ScrollView alwaysBounceVertical={false}>
          {billsArray.map((bill, index) => (
            <BillsItem
              item={bill}
              key={index}
              onPress={this.props.actions.editBill}
              icon={Platform.select({
                ios: 'ios-remove-circle-outline',
                android: 'md-remove-circle',
              })}
              iconSize={32}
              iconColor={colors.danger}
              onPressIcon={this.deleteBill}
            >
              <Text>{bill.description}</Text>
              <Text note>{`${I18n.t('bills.expirationDayLabel')}: ${bill.expirationDay}`}</Text>
              <Text note>{`${I18n.t('bills.valueLabel')}: ${getFormattedMoney(bill.value)}`}</Text>
            </BillsItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const Bills = connect(mapStateToProps, mapDispatchToProps)(BillsComponent);
export const UnconnectedBills = BillsComponent;
