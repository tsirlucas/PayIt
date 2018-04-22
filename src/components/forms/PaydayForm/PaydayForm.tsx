import * as React from 'react';
import {connect} from 'react-redux';
import {Container} from 'native-base';

import {WheelPicker} from 'components/common';

import {ConfirmButton, confirmButtonStyle} from '../ConfirmButton';
import {FormHeader} from '../FormHeader';
import {I18n} from './i18n';
import {mapDispatchToProps, MapDispatchToProps} from './PaydayForm.selectors';
import {style} from './PaydayForm.style';

type State = {
  selectedItem: string;
  itemList: string[];
};

type NavigatorProps = {
  edit: boolean;
};

class PaydayFormComponent extends React.Component<MapDispatchToProps & NavigatorProps, State> {
  state: State = {
    selectedItem: '0',
    itemList: Array(31)
      .fill(1)
      .map((_val, idx: number) => (1 + idx).toString()),
  };

  render() {
    return (
      <Container style={[style.container, confirmButtonStyle.container]}>
        <FormHeader
          header={I18n.t('paydayForm.header')}
          subHeader={I18n.t('paydayForm.subHeader')}
          secSubHeader={`${I18n.t('paydayForm.secSubHeader')} ;)`}
        />
        <WheelPicker
          data={this.state.itemList}
          style={{width: 150, height: 180, marginTop: -180}}
          selectedValue={this.state.selectedItem}
          itemStyle={{
            color: '#000000',
            fontSize: 26,
          }}
          onValueChange={this.onPickerSelect}
        />
        <ConfirmButton onPress={this.onSubmit} />
      </Container>
    );
  }

  onPickerSelect = (index: string) => {
    this.setState({
      selectedItem: index,
    });
  };

  onSubmit = () => {
    const parsedIndex = parseInt(this.state.selectedItem, 10);
    const parsedValue = parseInt(this.state.itemList[parsedIndex], 10);
    this.props.actions.setPayday({value: parsedValue, edit: this.props.edit});
  };
}

export const PaydayForm = connect(null, mapDispatchToProps)(PaydayFormComponent);
