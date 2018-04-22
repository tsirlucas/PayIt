import {bindActionCreators, Dispatch} from 'redux';
import {$Call} from 'utility-types';

import {actions} from 'core/bills';
import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  bills: state.bills.data,
});

export const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators(
    {editBill: actions.editBill, createBill: actions.newBill, deleteBill: actions.deleteBill},
    dispatch,
  ),
});

export type MapDispatchToProps = $Call<typeof mapDispatchToProps>;
export type MapStateToProps = $Call<typeof mapStateToProps>;
