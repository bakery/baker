/* eslint-disable object-shorthand, comma-dangle, eol-last, import/imports-first */

import { combineReducers } from 'redux';
import apollo from './apollo';

// XX: Do not rename this variable if you want reducer generator
// to keep working properly (and you do want that, right?)
const applicationReducers = {
  removeThisReducerOnceYouAddALegitOne: () => ({}),
  apollo: apollo.reducer(),
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
