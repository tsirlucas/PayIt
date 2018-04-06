import {$Call} from 'utility-types';

import {RootState} from 'src/core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  active: state.global.activityIndicator,
});

export type MapStateToProps = $Call<typeof mapStateToProps>;
