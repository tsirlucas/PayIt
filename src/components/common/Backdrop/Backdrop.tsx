import * as React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import {mapStateToProps, MapStateToProps} from './Backdrop.selectors';
import {style} from './Backdrop.style';

const BackdropComponent = (props: MapStateToProps) =>
  props.active ? (
    <View style={style.container}>
      <TouchableWithoutFeedback onPress={() => props.closeCB()} style={style.content}>
        <View style={style.content} />
      </TouchableWithoutFeedback>
    </View>
  ) : null;

export const Backdrop = connect(mapStateToProps)(BackdropComponent);
