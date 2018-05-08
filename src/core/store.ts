import {applyMiddleware, createStore} from 'redux';
import {Action} from 'redux-act';
import createSagaMiddleware from 'redux-saga';

import {SentryService} from 'src/services';

import {rootReducer, RootState} from './rootReducer';
import {rootSaga} from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export type RootState = RootState;
export type Dispatch = (action: Action<any>) => void;

export const store = createStore<RootState>(rootReducer, applyMiddleware(sagaMiddleware));

const rootTask = sagaMiddleware.run(rootSaga);
rootTask.done.catch((err) => {
  SentryService.getInstance().captureException(err);
  console.error(err.message);
});
