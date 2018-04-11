import * as React from 'react';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Body, List, ListItem, Text, Thumbnail} from 'native-base';

import {MapStateToProps, mapStateToProps} from './Bills.selectors';
import {style} from './Bills.style';

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

const priorityBarColors: {[index: number]: string} = {
  1: '#62B1F6',
  2: '#f0ad4e',
  3: '#d9534f',
};

class BillsComponent extends React.Component<MapStateToProps> {
  render() {
    if (this.props.bills === null) return <Text>Loading...</Text>;

    const billsArray = Object.values(this.props.bills);

    if (billsArray.length === 0) return <Text>Empty</Text>;

    return (
      <List>
        <ScrollView>
          {billsArray.map((bill, index) => (
            <ListItem key={index}>
              <Thumbnail square size={80} source={imagesMap.default} />
              <Body>
                <Text>{bill.description}</Text>
                <Text note>{`Expiration day: ${bill.expirationDay}`}</Text>
                <Text note>{`Value: $${bill.value}`}</Text>
              </Body>
              <View
                style={[style.priorityBar, {backgroundColor: priorityBarColors[bill.priority]}]}
              />
            </ListItem>
          ))}
        </ScrollView>
      </List>
    );
  }
}
export const Bills = connect(mapStateToProps)(BillsComponent);
