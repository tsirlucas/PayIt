import {bindActionCreators, Dispatch} from 'redux';

import {actions} from 'core/bills';
import {RootState} from 'core/rootReducer';
import {Bill} from 'src/models';

export const mapStateToProps = (state: RootState) => ({
  bill: state.bills.editing ? state.bills.data[state.bills.editing] : (null as Bill),
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({saveBill: actions.saveBill}, dispatch),
});

export type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;
export type MapStateToProps = ReturnType<typeof mapStateToProps>;
