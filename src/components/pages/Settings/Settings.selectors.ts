import {$Call} from 'utility-types';

import {RootState} from 'core/rootReducer';

// import {bindActionCreators, Dispatch} from 'redux';
// import {actions as pendenciesActions} from 'core/pendencies';
export const mapStateToProps = (state: RootState) => ({
  user: state.user.data,
});

// export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
//   actions: bindActionCreators({openPendenciesModal: pendenciesActions.openPendenciesModal}, dispatch),
// });

// export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
export type MapStateToProps = $Call<typeof mapStateToProps>;
