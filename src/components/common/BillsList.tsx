import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Body, Button, ListItem, Thumbnail} from 'native-base';

import {Bill, Pendency} from 'models';

type BillsItemProps = {
  item: Bill | Pendency;
  onPress?: (id: string) => void;
  children: Element[];
  icon: string;
  iconSize: number;
  iconColor: string;
  onPressIcon: (id: string) => void;
};

const imagesMap = {
  default: require('assets/img/default-bill-image.png'),
};

export const BillsItem = (props: BillsItemProps) => (
  <ListItem onPress={props.onPress && (() => props.onPress(props.item.id))}>
    <Thumbnail square size={80} source={imagesMap.default} />
    <Body>{props.children}</Body>
    <Button
      style={{alignSelf: 'center'}}
      transparent
      rounded
      onPress={() => props.onPressIcon(props.item.id)}
    >
      <Icon
        name={props.icon}
        size={props.iconSize}
        color={props.iconColor}
        style={{color: props.iconColor}}
      />
    </Button>
  </ListItem>
);
