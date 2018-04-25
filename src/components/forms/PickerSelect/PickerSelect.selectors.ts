import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions as globalActions} from 'core/global';

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators(
    {showBackdrop: globalActions.showBackdrop, hideBackdrop: globalActions.hideBackdrop},
    dispatch,
  ),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
