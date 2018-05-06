import {Action, bindActionCreators, Dispatch} from 'redux';

import {actions} from 'core/global';
import {RootState} from 'src/core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  active: state.global.backdrop,
});

export const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  actions: bindActionCreators({hideBackdrop: actions.hideBackdrop}, dispatch),
});

export type MapStateToProps = ReturnType<typeof mapStateToProps>;
export type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
