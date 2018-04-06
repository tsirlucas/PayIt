import * as React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Content, Spinner} from 'native-base';

import {mapStateToProps, MapStateToProps} from './ActivityIndicator.selectors';
import {style} from './ActivityIndicator.style';

const ActivityIndicatorComponent = (props: MapStateToProps) =>
  props.active ? (
    <View style={style.container}>
      <Content contentContainerStyle={style.content}>
        <Spinner color="gray" />
      </Content>
    </View>
  ) : null;

export const ActivityIndicator = connect(mapStateToProps)(ActivityIndicatorComponent);
