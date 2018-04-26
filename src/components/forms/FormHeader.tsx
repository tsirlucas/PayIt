import * as React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from 'native-base';
import {isSmallDevice} from 'utils';

type Props = {
  header: string;
  subHeader?: string;
  secSubHeader?: string;
  headerStyle?: ViewStyle;
  subHeaderStyle?: ViewStyle;
  secSubHeaderStyle?: ViewStyle;
};

const style = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 25,
  },
  subHeader: {
    fontSize: isSmallDevice() ? 18 : 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  secSubHeader: {
    fontSize: isSmallDevice() ? 14 : 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export const FormHeader = (props: Props) => (
  <View style={style.view}>
    <Text style={[style.header, props.headerStyle]}>{props.header}</Text>
    <Text style={[style.subHeader, props.subHeaderStyle]}>{props.subHeader}</Text>
    <Text style={[style.secSubHeader, props.secSubHeaderStyle]}>{props.secSubHeader}</Text>
  </View>
);
