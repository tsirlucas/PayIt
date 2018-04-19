import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions as pendenciesActions} from 'core/pendencies';
import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  pendencies: state.pendencies.data,
  userName: state.user.data.displayName,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({openPendenciesModal: pendenciesActions.openPendenciesModal}, dispatch),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
export type MapStateToProps = $Call<typeof mapStateToProps>;
