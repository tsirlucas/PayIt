import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{getMessage('Hello world!')}</Text>
      </View>
    );
  }
}

const getMessage = (message: string): string => {
  return message;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
