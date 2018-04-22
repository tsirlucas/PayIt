import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions} from 'core/bills';
import {RootState} from 'core/rootReducer';
import {Bill} from 'src/models';

export const mapStateToProps = (state: RootState) => ({
  bill: state.bills.editing ? state.bills.data[state.bills.editing] : (null as Bill),
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators({saveBill: actions.saveBill}, dispatch),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
export type MapStateToProps = $Call<typeof mapStateToProps>;
