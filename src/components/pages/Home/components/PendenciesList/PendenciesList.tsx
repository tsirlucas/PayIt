import * as React from 'react';
import {Alert, Platform, ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {List, Text} from 'native-base';
import {colors} from 'style';
import {getFormattedMoney} from 'utils';

import {Loading} from 'components/common';
import {BillsItem} from 'components/common/BillsList';

import {I18n} from './i18n';
import {
  MapDispatchToProps,
  mapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './PendenciesList.selectors';

type NavigatorProps = {type: 'delayed' | 'ideal' | 'next'};
type Props = MapStateToProps & MapDispatchToProps & NavigatorProps;

class PendenciesListComponent extends React.Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    const pendenciesToList = nextProps.pendencies[nextProps.type];

    if (pendenciesToList.length === 0) Actions.pop();
  }

  deletePendency = (pendencyId: string) => {
    Alert.alert(I18n.t('global.confirmDialog.title'), I18n.t('global.confirmDialog.msg'), [
      {text: I18n.t('global.confirmDialog.cancel'), style: 'cancel'},
      {
        text: I18n.t('global.confirmDialog.confirm'),
        onPress: () => this.props.actions.payPendency(pendencyId),
      },
    ]);
  };

  render() {
    if (this.props.pendencies === null) return <Loading />;

    const pendenciesToList = this.props.pendencies[this.props.type];

    return (
      <List>
        <ScrollView alwaysBounceVertical={false}>
          {pendenciesToList.map((pendency, index) => (
            <BillsItem
              item={pendency}
              key={index}
              icon={Platform.select({
                ios: 'ios-checkmark-circle-outline',
                android: 'md-checkmark-circle',
              })}
              iconSize={32}
              iconColor={colors.success}
              onPressIcon={this.deletePendency}
            >
              <Text>{pendency.description}</Text>
              <Text note>{`${I18n.t('pendenciesList.expirationDayLabel')}: ${I18n.strftime(
                new Date(pendency.expirationDay),
                '%d/%m/%Y',
              )}`}</Text>
              <Text note>{`${I18n.t('pendenciesList.valueLabel')}: ${getFormattedMoney(
                pendency.value,
              )}`}</Text>
            </BillsItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const PendenciesList = connect(mapStateToProps, mapDispatchToProps)(PendenciesListComponent);
