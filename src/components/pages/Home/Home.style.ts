import {StyleSheet} from 'react-native';
import {colors} from 'style/vars';

export const style: {[index: string]: Object} = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column', justifyContent: 'space-around'},
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
    marginTop: 30,
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  list: {
    alignSelf: 'center',
    height: 200,
    flex: 0,
    flexGrow: 0,
  },
  listContent: {
    paddingLeft: 15,
    maxHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    height: 100,
    maxHeight: 100,
    width: 180,
    borderRadius: 5,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  noPendenciesView: {
    alignSelf: 'center',
    height: 200,
    flex: 0,
    flexGrow: 0,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPendenciesSubView: {
    maxHeight: 200,
  },
  noPendencies: {
    height: 100,
    width: 260,
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
