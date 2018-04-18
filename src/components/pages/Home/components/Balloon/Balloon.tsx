import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  text: string;
};

export class Balloon extends React.Component<Props> {
  render() {
    return (
      <View style={style.container}>
        <View style={style.content}>
          <Text style={style.text}>{this.props.text}</Text>
        </View>
        <View style={style.delta} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  container: {
    height: 55,
    width: '90%',
    margin: 10,
    alignSelf: 'center',
    position: 'relative',
  },

  content: {
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  delta: {
    position: 'absolute',
    right: 100,
    bottom: -60,
    marginBottom: 30,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 20,
    borderBottomWidth: 10,
    borderRightWidth: 30,
    borderLeftWidth: 30,
    borderTopColor: 'white',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
