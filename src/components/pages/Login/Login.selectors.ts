import {bindActionCreators, Dispatch} from 'redux';
import {$call} from 'utility-types';

import {actions as userActions} from 'core/user';

export const mapStateToProps = () => ({});
export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({signIn: userActions.signIn}, dispatch),
});

const mapStateToPropsNope = $call(mapStateToProps);
export type MapStateToProps = typeof mapStateToPropsNope;

const mapDispatchToPropsNope = $call(mapDispatchToProps);
export type MapDispatchToProps = typeof mapDispatchToPropsNope;
