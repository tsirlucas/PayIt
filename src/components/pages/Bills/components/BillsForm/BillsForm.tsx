import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {Container, Content, Form} from 'native-base';
import Masked from 'vanilla-masker';

import {CustomInput, PickerSelect, PickerSelectAnimationTimeout} from 'components/forms';
import {ConfirmButton, confirmButtonStyle} from 'components/forms/ConfirmButton';
import {Bill} from 'src/models';

import {frequencyOptions, typeOptions} from './BillsForm.constants';
import {
  MapDispatchToProps,
  mapDispatchToProps,
  MapStateToProps,
  mapStateToProps,
} from './BillsForm.selectors';
import {I18n} from './i18n';

type NavigatorProps = {billId?: string};
type Props = MapStateToProps & MapDispatchToProps & NavigatorProps;

type State = {bill: Bill; valid: {[index: string]: boolean}};

class BillsFormComponent extends React.Component<Props, State> {
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

  isFormValid = () => {
    const {description, value, type, frequency, generationDay, expirationDay} = this.state.bill;
    return description && value && type && frequency && generationDay && expirationDay;
  };

  render() {
    return (
      <Container style={confirmButtonStyle.container}>
        <Content>
          <Form>
            <CustomInput
              label={I18n.t('billsForm.inputs.description.label')}
              value={this.state.bill.description}
              maxLength={30}
              onChangeText={(text) => this.setBillProperty('description', text, this.notEmpty)}
              valid={this.state.valid.description !== false}
              errorMessage={I18n.t('billsForm.inputs.description.requiredMessage')}
            />
            <CustomInput
              label={I18n.t('billsForm.inputs.value.label')}
              keyboardType={Platform.select({ios: 'number-pad', android: 'numeric'})}
              value={this.state.bill.value ? this.state.bill.value.toFixed(2) : ''}
              maxLength={14}
              onChangeText={(text) =>
                this.setBillProperty('value', text, (value: number) => value > 0)
              }
              valid={this.state.valid.value !== false}
              mask={this.moneyMask}
              unMask={this.moneyUnMask}
              errorMessage={I18n.t('billsForm.inputs.value.requiredMessage')}
            />
            <PickerSelect
              placeholder={I18n.t('billsForm.inputs.type.placeholder')}
              value={this.state.bill.type}
              disabled
              onValueChange={(value: string) => this.setBillProperty('type', value)}
              items={[
                {
                  label: I18n.t('billsForm.inputs.type.options.bill'),
                  value: typeOptions.BILL,
                },
              ]}
            />
            <PickerSelect
              placeholder={I18n.t('billsForm.inputs.frequency.placeholder')}
              value={this.state.bill.frequency}
              disabled
              onValueChange={(value: string) => this.setBillProperty('frequency', value)}
              items={[
                {
                  label: I18n.t('billsForm.inputs.frequency.options.monthly'),
                  value: frequencyOptions.MONTHLY,
                },
              ]}
            />
            <PickerSelect
              placeholder={I18n.t('billsForm.inputs.generationDay.placeholder')}
              value={this.state.bill.generationDay}
              onValueChange={(value: number) => this.setBillProperty('generationDay', value)}
              items={this.getDaysOfMonthOptions()}
            />
            <PickerSelect
              placeholder={I18n.t('billsForm.inputs.expirationDay.placeholder')}
              value={this.state.bill.expirationDay}
              onValueChange={(value: number) => this.setBillProperty('expirationDay', value)}
              items={this.getDaysOfMonthOptions()}
            />
          </Form>
        </Content>
        <ConfirmButton
          onPress={() => this.props.actions.saveBill(this.state.bill)}
          disabled={!this.isFormValid()}
        />
      </Container>
    );
  }
}
export const BillsForm = connect(mapStateToProps, mapDispatchToProps)(BillsFormComponent);
