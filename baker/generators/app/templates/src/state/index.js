import { createStore, compose, applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import devTools from 'remote-redux-devtools';
import Parse from 'parse/react-native';
import createReducer from './reducers';
import sagas from '../sagas';
import Settings from '../settings';

const settings = Settings.load();

Parse.initialize(settings.parseServerApplicationId);
Parse.serverURL = settings.parseServerURL;

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState = fromJS({})) {
  const enhancers = [
    applyMiddleware(sagaMiddleware),
  ];

  if (__DEV__) {
    enhancers.push(devTools());
  }

  const store = createStore(createReducer(), initialState, compose(...enhancers));

  sagas.forEach(saga => sagaMiddleware.run(saga));

  return store;
}

module.exports = configureStore;
