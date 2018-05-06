import {createAction} from 'redux-act';

export const actions = {
  showActivityIndicator: createAction('global/SHOW_ACTIVITY_INDICATOR'),
  hideActivityIndicator: createAction('global/HIDE_ACTIVITY_INDICATOR'),
  initApplication: createAction('global/INIT_APPLICATION'),
  showBackdrop: createAction('global/SHOW_BACKDROP'),
  hideBackdrop: createAction('global/HIDE_BACKDROP'),
};
