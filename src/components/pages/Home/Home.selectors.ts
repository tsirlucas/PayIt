import {bindActionCreators, Dispatch} from 'redux';

import {actions as pendenciesActions} from 'core/pendencies';
import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  pendencies: state.pendencies.data,
  userName: state.user.data.displayName,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({openPendenciesModal: pendenciesActions.openPendenciesModal}, dispatch),
});

export type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
export type MapStateToProps = ReturnType<typeof mapStateToProps>;
