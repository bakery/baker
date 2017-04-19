/* eslint no-param-reassign: off, no-underscore-dangle: off */

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { getCurrentUser } from './auth';
import Settings from '../settings';

const settings = Settings.load();
const networkInterface = createNetworkInterface({ uri: settings.graphqlURL });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    getCurrentUser().then(user => {
      const sessionToken = user && user.getSessionToken();
      
      if (sessionToken) {
        req.options.headers.authorization = sessionToken;
      }

      next();
    }, error => {
      next();
    });
  },
}]);

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }

    // Make sure to return null if this object doesn't have an ID
    return null;
  },
});

export default client;
