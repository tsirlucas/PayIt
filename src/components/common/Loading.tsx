import * as React from 'react';
import {View} from 'react-native';
import {Spinner} from 'native-base';
import {primaryColor} from 'style';

export const Loading = () => (
  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    <Spinner color={primaryColor} />
  </View>
);
