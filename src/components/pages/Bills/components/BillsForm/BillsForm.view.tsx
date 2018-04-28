import * as React from 'react';
import {Platform} from 'react-native';
import {Container, Content, Form} from 'native-base';

import {CustomInput, PickerSelect} from 'components/forms';
import {ConfirmButton, confirmButtonStyle} from 'components/forms/ConfirmButton';
import {Bill} from 'models';

import {BillsFormProps} from './BillsForm.container';
import {I18n} from './i18n';

type Options = {value: string | number; label: string}[];

type ViewProps = {
  bill: Bill;
  valid: {[index: string]: boolean};
  setBillProperty: <T extends {}>(key: string, value: T, validation?: Function) => void;
  notEmpty: (value: string) => boolean;
  moneyMask: (value: string) => string;
  moneyUnMask: (value: string) => number;
  getDaysOfMonthOptions: () => Options;
  getFrequencyOptions: () => Options;
  getTypeOptions: () => Options;
  isFormValid: () => boolean;
};

type Props = BillsFormProps & ViewProps;

const CustomInputs = (props: Props) => (
  <>
    <CustomInput
      label={I18n.t('billsForm.inputs.description.label')}
      value={props.bill.description}
      maxLength={30}
      onChangeText={(text) => props.setBillProperty('description', text, props.notEmpty)}
      valid={props.valid.description !== false}
      errorMessage={I18n.t('billsForm.inputs.description.requiredMessage')}
    />
    <CustomInput
      label={I18n.t('billsForm.inputs.value.label')}
      keyboardType={Platform.select({ios: 'number-pad', android: 'numeric'})}
      value={props.bill.value ? props.bill.value.toFixed(2) : ''}
      maxLength={14}
      onChangeText={(text) => props.setBillProperty('value', text, (value: number) => value > 0)}
      valid={props.valid.value !== false}
      mask={props.moneyMask}
      unMask={props.moneyUnMask}
      errorMessage={I18n.t('billsForm.inputs.value.requiredMessage')}
    />
  </>
);

export const Pickers = (props: Props) => (
  <>
    <PickerSelect
      placeholder={I18n.t('billsForm.inputs.type.placeholder')}
      value={props.bill.type}
      disabled
      onValueChange={(value: string) => props.setBillProperty('type', value)}
      items={props.getTypeOptions()}
    />
    <PickerSelect
      placeholder={I18n.t('billsForm.inputs.frequency.placeholder')}
      value={props.bill.frequency}
      disabled
      onValueChange={(value: string) => props.setBillProperty('frequency', value)}
      items={props.getFrequencyOptions()}
    />
    <PickerSelect
      placeholder={I18n.t('billsForm.inputs.generationDay.placeholder')}
      value={props.bill.generationDay}
      onValueChange={(value: number) => props.setBillProperty('generationDay', value)}
      items={props.getDaysOfMonthOptions()}
    />
    <PickerSelect
      placeholder={I18n.t('billsForm.inputs.expirationDay.placeholder')}
      value={props.bill.expirationDay}
      onValueChange={(value: number) => props.setBillProperty('expirationDay', value)}
      items={props.getDaysOfMonthOptions()}
    />
  </>
);

export const BillsFormView = (props: Props) => (
  <Container style={confirmButtonStyle.container}>
    <Content>
      <Form>
        <CustomInputs {...props} />
        <Pickers {...props} />
      </Form>
    </Content>
    <ConfirmButton
      onPress={() => props.actions.saveBill(props.bill)}
      disabled={!props.isFormValid()}
    />
  </Container>
);
