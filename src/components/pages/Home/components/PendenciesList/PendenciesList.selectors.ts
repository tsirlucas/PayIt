import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions as pendenciesActions} from 'core/pendencies';
import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  pendencies: state.pendencies.data,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({payPendency: pendenciesActions.payPendency}, dispatch),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
export type MapStateToProps = $Call<typeof mapStateToProps>;
