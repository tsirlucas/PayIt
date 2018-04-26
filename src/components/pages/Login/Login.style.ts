import {StyleSheet} from 'react-native';
import {primaryColor} from 'style';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
  },
  content: {
    height: 400,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 30,
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    color: '#FFF',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 40,
  },
  buttons: {
    alignSelf: 'center',
  },
});
