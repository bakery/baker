import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './state';

const store = configureStore();

function setup() {
  class Root extends Component {
    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

module.exports = setup;
