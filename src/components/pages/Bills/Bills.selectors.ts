import {$Call} from 'utility-types';

import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  bills: state.bills.data,
});

export type MapStateToProps = $Call<typeof mapStateToProps>;
