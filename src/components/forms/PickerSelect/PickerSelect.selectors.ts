import {Action, bindActionCreators, Dispatch} from 'redux';

import {actions as globalActions} from 'core/global';
import {RootState} from 'src/core';

export const mapStateToProps = (state: RootState) => ({
  backdrop: state.global.backdrop,
});

export const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  actions: bindActionCreators(
    {showBackdrop: globalActions.showBackdrop, hideBackdrop: globalActions.hideBackdrop},
    dispatch,
  ),
});

export type MapStateToProps = ReturnType<typeof mapStateToProps>;
export type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
