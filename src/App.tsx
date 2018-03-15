import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from 'core';

import Routes from './Routes';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}
