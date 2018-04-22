import * as React from 'react';
import {View} from 'react-native';
import Picker from 'react-native-picker-select';
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

type Props<T extends ComponentProps> = T;

type State = {
  value: Value;
  ready: boolean;
};

export const PickerSelectAnimationTimeout = 500;

export class PickerSelect<T extends ComponentProps> extends React.Component<Props<T>, State> {
  state: State = {} as State;

  componentDidMount() {
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

  render() {
    return (
      <Picker {...this.props} placeholder={{}}>
        <View>
          <Item floatingLabel disabled={this.props.disabled}>
            <Label>{this.props.placeholder}</Label>
            <Input
              disabled={this.props.disabled}
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
        </View>
      </Picker>
    );
  }
}
