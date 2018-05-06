import * as React from 'react';
import {AppState, BackHandler, View} from 'react-native';
import I18n from 'react-native-i18n';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {Input, Item, Label} from 'native-base';

import {
  MapDispatchToProps,
  mapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './PickerSelect.selectors';

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

type Props<T extends ComponentProps> = T & MapStateToProps & MapDispatchToProps;

type State = {
  value: Value;
  ready: boolean;
  mappedValues: MappedValues;
  isPickerShow: boolean;
};

export const PickerSelectAnimationTimeout = 500;

class PickerSelectComponent<T extends ComponentProps> extends React.Component<Props<T>, State> {
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

    this.checkIfPickerShouldClose(this.props.backdrop, nextProps.backdrop);
  }

  checkIfPickerShouldClose(currBackdrop: boolean, nextBackdrop: boolean) {
    if (currBackdrop !== nextBackdrop && !nextBackdrop) {
      this.closePicker();
    }
  }

  find = (arr: ItemT[], value: Value) => {
    const result = arr.filter((item: ItemT) => {
      return item.value === value;
    });
    return result[0] || arr[0];
  };

  onOpenPicker = () => {
    let settings = {
      pickerData: Object.keys(this.state.mappedValues),
      selectedValue: [this.find(this.props.items, this.props.value).label],
      onPickerConfirm: (data: string[]) => {
        this.closePicker();
        this.props.onValueChange(this.state.mappedValues[data[0]]);
      },
      pickerCancelBtnText: '',
      pickerTitleText: '',
      pickerConfirmBtnText: I18n.t('confirmButton') + '  ',
      pickerToolBarBg: [54, 174, 129, 1],
      pickerBg: [245, 238, 238, 1],
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerFontColor: [54, 174, 129, 1],
    };
    Picker.init(settings);
    this.openPicker();
  };

  closeIfBackground = (status: string) => {
    if (status === 'background') this.closePicker();
  };

  openPicker = () => {
    Picker.show();
    this.props.actions.showBackdrop();
    this.setState({...this.state, isPickerShow: true});
    BackHandler.addEventListener('hardwareBackPress', this.closePicker);
    AppState.addEventListener('change', this.closeIfBackground);
  };

  closePicker = () => {
    Picker.hide();
    this.props.actions.hideBackdrop();
    this.setState({...this.state, isPickerShow: false});
    BackHandler.removeEventListener('hardwareBackPress', this.closePicker);
    AppState.removeEventListener('change', this.closeIfBackground);
    return true;
  };

  componentWillUnmount() {
    this.closePicker();
  }

  render() {
    return (
      <View key="pickerInput" onTouchStart={!this.props.disabled && this.onOpenPicker}>
        <Item floatingLabel disabled={this.props.disabled}>
          <Label>{this.props.placeholder}</Label>
          <Input
            disabled={true}
            value={this.state.ready ? this.find(this.props.items, this.state.value).label : null}
          />
        </Item>
        <Icon
          name={this.props.disabled ? 'md-lock' : 'md-arrow-dropdown'}
          color="gray"
          size={this.props.disabled ? 16 : 24}
          style={{
            color: 'gray',
            position: 'absolute',
            right: 15,
            top: this.props.disabled ? '38%' : '35%',
          }}
        />
      </View>
    );
  }
}

export const PickerSelect = connect(mapStateToProps, mapDispatchToProps)(PickerSelectComponent);
