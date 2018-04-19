import {$Call} from 'utility-types';

import {RootState} from 'core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  pendencies: state.pendencies.data,
});

export type MapStateToProps = $Call<typeof mapStateToProps>;
