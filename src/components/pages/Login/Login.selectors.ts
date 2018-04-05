import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions as userActions} from 'core/user';

export const mapStateToProps = () => ({});
export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({signIn: userActions.signIn}, dispatch),
});

export type MapStateToProps = $Call<typeof mapStateToProps>;

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
