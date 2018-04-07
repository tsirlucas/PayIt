import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions as userActions} from 'core/user';

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({setPayday: userActions.setPayday}, dispatch),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
