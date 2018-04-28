import * as React from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Body, Button, ListItem, Thumbnail} from 'native-base';
import {$PropertyType} from 'utility-types';

import {Bill, Pendency} from 'models';
import {I18n} from 'src/i18n';

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

const iconAction = (id: string, action: $PropertyType<BillsItemProps, 'onPressIcon'>) => {
  Alert.alert(I18n.t('global.confirmDialog.title'), I18n.t('global.confirmDialog.msg'), [
    {text: I18n.t('global.confirmDialog.cancel'), style: 'cancel'},
    {
      text: I18n.t('global.confirmDialog.confirm'),
      onPress: () => action(id),
    },
  ]);
};

export const BillsItem = (props: BillsItemProps) => (
  <ListItem onPress={props.onPress && (() => props.onPress(props.item.id))}>
    <Thumbnail square size={80} source={imagesMap.default} />
    <Body>{props.children}</Body>
    <Button
      style={{alignSelf: 'center'}}
      transparent
      rounded
      onPress={() => iconAction(props.item.id, props.onPressIcon)}
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
