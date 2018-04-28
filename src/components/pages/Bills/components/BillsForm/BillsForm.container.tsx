import * as React from 'react';
import {connect} from 'react-redux';
import Masked from 'vanilla-masker';

import {PickerSelectAnimationTimeout} from 'components/forms';
import {Bill} from 'models';
import {BillsFormView} from 'src/components/pages/Bills/components/BillsForm/BillsForm.view';

import {frequencyOptions, typeOptions} from './BillsForm.constants';
import {
  MapDispatchToProps,
  mapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './BillsForm.selectors';
import {I18n} from './i18n';

type NavigatorProps = {billId?: string};
export type BillsFormProps = MapStateToProps & MapDispatchToProps & NavigatorProps;

type State = {bill: Bill; valid: {[index: string]: boolean}};

class BillsFormComponent extends React.Component<BillsFormProps, State> {
  state = {bill: {}, valid: {}} as State;

  componentDidMount() {
    if (this.props.bill) {
      setTimeout(() => this.setState({bill: this.props.bill}), PickerSelectAnimationTimeout);
    }
  }

  setBillProperty = <T extends {}>(key: string, value: T, validation?: Function) => {
    this.setState({
      bill: {...this.state.bill, [key]: value},
      valid: {...this.state.valid, [key]: validation ? validation(value) : true},
    });
  };

  notEmpty = (value: string) => {
    return value ? value.length > 0 : false;
  };

  moneyMask = (value: string) => {
    const sanitalized = value.replace(/\D/g, '');

    return Masked.toMoney(sanitalized, {
      precision: 2,
      separator: I18n.t('utils.valueSeparator'),
      delimiter: I18n.t('utils.valueDelimiter'),
    });
  };

  moneyUnMask = (text: string) => {
    return parseFloat(
      text
        .replace(new RegExp(`\\${I18n.t('utils.valueDelimiter')}`, 'g'), '')
        .replace(I18n.t('utils.valueSeparator'), '.'),
    );
  };

  getDaysOfMonthOptions = () => {
    const days = [];

    for (let i = 1; i <= 31; i++) {
      days.push({value: i, label: i.toString()});
    }
    return days;
  };

  getFrequencyOptions = () => [
    {
      label: I18n.t('billsForm.inputs.frequency.options.monthly'),
      value: frequencyOptions.MONTHLY,
    },
  ];

  getTypeOptions = () => [
    {
      label: I18n.t('billsForm.inputs.type.options.bill'),
      value: typeOptions.BILL,
    },
  ];

  isFormValid = () => {
    const {description, value, type, frequency, generationDay, expirationDay} = this.state.bill;
    return !!(description && value && type && frequency && generationDay && expirationDay);
  };

  render() {
    return (
      <BillsFormView
        {...this.props}
        bill={this.state.bill}
        valid={this.state.valid}
        setBillProperty={this.setBillProperty}
        notEmpty={this.notEmpty}
        moneyMask={this.moneyMask}
        moneyUnMask={this.moneyUnMask}
        getDaysOfMonthOptions={this.getDaysOfMonthOptions}
        getFrequencyOptions={this.getFrequencyOptions}
        getTypeOptions={this.getTypeOptions}
        isFormValid={this.isFormValid}
      />
    );
  }
}
export const BillsForm = connect(mapStateToProps, mapDispatchToProps)(BillsFormComponent);
