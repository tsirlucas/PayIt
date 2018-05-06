import * as React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import {
  mapDispatchToProps,
  MapDispatchToProps,
  mapStateToProps,
  MapStateToProps,
} from './Backdrop.selectors';
import {style} from './Backdrop.style';

type Props = MapStateToProps & MapDispatchToProps;

const BackdropComponent = (props: Props) =>
  props.active ? (
    <View style={style.container}>
      <TouchableWithoutFeedback onPress={() => props.actions.hideBackdrop()} style={style.content}>
        <View style={style.content} />
      </TouchableWithoutFeedback>
    </View>
  ) : null;

export const Backdrop = connect(mapStateToProps, mapDispatchToProps)(BackdropComponent);
