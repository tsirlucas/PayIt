import {RootState} from 'src/core/rootReducer';

export const mapStateToProps = (state: RootState) => ({
  active: state.global.activityIndicator,
});

export type MapStateToProps = ReturnType<typeof mapStateToProps>;
