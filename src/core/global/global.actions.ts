import {createAction} from 'redux-act';

export const actions = {
  showActivityIndicator: createAction('global/SHOW_ACTIVITY_INDICATOR'),
  hideActivityIndicator: createAction('global/HIDE_ACTIVITY_INDICATOR'),
};
