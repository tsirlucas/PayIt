import {StyleSheet} from 'react-native';
import {colors} from 'style/vars';

export const style: {[index: string]: Object} = StyleSheet.create({
  bigFont: {
    fontSize: 23,
  },
  delayed: {
    color: colors.danger,
  },
  ideal: {
    color: colors.warning,
  },
  next: {
    color: colors.info,
  },
  greenFont: {
    color: colors.success,
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  list: {
    alignSelf: 'center',
  },
  listContent: {
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    width: 180,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 5,
  },
  noPendenciesView: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPendencies: {
    height: 110,
    width: 260,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
