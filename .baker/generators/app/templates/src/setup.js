import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './state';
import { ApolloProvider } from 'react-apollo';
import apollo from './state/apollo';

const store = configureStore();

function setup() {
  class Root extends Component {
    render() {
      return (
        <ApolloProvider store={store} client={apollo}>
          <App />
        </ApolloProvider>
      );
    }
  }

  return Root;
}

module.exports = setup;
