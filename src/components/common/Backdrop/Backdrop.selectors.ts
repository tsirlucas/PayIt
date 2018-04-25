import {$Call} from 'utility-types';

import {RootState} from 'src/core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  active: state.global.backdrop,
  closeCB: state.global.backdropCB,
});

export type MapStateToProps = $Call<typeof mapStateToProps>;
