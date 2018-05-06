import {bindActionCreators, Dispatch} from 'redux';

import {RootState} from 'core/rootReducer';
import {actions} from 'core/user';

export const mapStateToProps = (state: RootState) => ({
  user: state.user.data,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({changeUserName: actions.changeUserName}, dispatch),
});

export type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
export type MapStateToProps = ReturnType<typeof mapStateToProps>;
