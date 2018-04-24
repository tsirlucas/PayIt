import * as React from 'react';
import {AppState, BackHandler, View} from 'react-native';
import I18n from 'react-native-i18n';
import Picker from 'react-native-picker';
import {Icon, Input, Item, Label} from 'native-base';

type Value = string | number;
type ItemT = {value: Value; label: string; key?: string};
type ComponentProps = {
  placeholder?: string;
  items: ItemT[];
  value: Value;
  disabled?: boolean;
  onValueChange: (value: Value) => void;
};
type MappedValues = {[index: string]: Value};

type Props<T extends ComponentProps> = T;

type State = {
  value: Value;
  ready: boolean;
  mappedValues: MappedValues;
  isPickerShow: boolean;
};

export const PickerSelectAnimationTimeout = 500;

export class PickerSelect<T extends ComponentProps> extends React.Component<Props<T>, State> {
  state: State = {} as State;

  componentDidMount() {
    const mappedValues = this.props.items.reduce(
      (curr, next) => {
        curr[next.label] = next.value;
        return curr;
      },
      {} as MappedValues,
    );
    this.setState({...this.state, mappedValues});
    setTimeout(() => this.setState({...this.state, ready: true}), PickerSelectAnimationTimeout);
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    const {value} = nextProps;
    if (this.state.ready && !value) {
      this.props.onValueChange(this.props.items[0].value);
    } else {
      this.setState({value});
    }
  }

  find = (arr: ItemT[], value: Value) => {
    const result = arr.filter((item: ItemT) => {
      return item.value === value;
    });
    return result[0] || arr[0];
  };

  onOpenPicker = () => {
    Picker.init({
      pickerData: Object.keys(this.state.mappedValues),
      selectedValue: [this.find(this.props.items, this.props.value).label],
      onPickerConfirm: (data) => {
        this.closePicker();
        this.props.onValueChange(this.state.mappedValues[data[0]]);
      },
      pickerCancelBtnText: null,
      pickerTitleText: null,
      pickerConfirmBtnText: I18n.t('confirmButton'),
    });
    this.openPicker();
  };

  closeIfBackground = (status: string) => {
    if (status === 'background') this.closePicker();
  };

  openPicker = () => {
    Picker.show();
    this.setState({...this.state, isPickerShow: true});
    BackHandler.addEventListener('hardwareBackPress', this.closePicker);
    AppState.addEventListener('change', this.closeIfBackground);
  };

  closePicker = () => {
    Picker.hide();
    this.setState({...this.state, isPickerShow: false});
    BackHandler.removeEventListener('hardwareBackPress', this.closePicker);
    AppState.removeEventListener('change', this.closeIfBackground);
    return true;
  };

  componentWillUnmount() {
    this.closePicker();
  }

  render() {
    return [
      this.state.isPickerShow && (
        <View
          key="closeView"
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 20}}
          onTouchStart={this.closePicker}
        />
      ),
      <View key="pickerInput" onTouchStart={!this.props.disabled && this.onOpenPicker}>
        <Item floatingLabel disabled={this.props.disabled}>
          <Label>{this.props.placeholder}</Label>
          <Input
            disabled={true}
            value={this.state.ready ? this.find(this.props.items, this.state.value).label : null}
          />
        </Item>
        <Icon
          name="md-arrow-dropdown"
          color="gray"
          style={{
            color: 'gray',
            position: 'absolute',
            right: 15,
            top: '30%',
          }}
        />
      </View>,
    ];
  }
}
