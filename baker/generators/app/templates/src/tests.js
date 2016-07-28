/* eslint no-param-reassign: "off", prefer-arrow-callback: "off" */

const config = {
  presets: ['react-native'],
};

// XX: see this for more details
// https://github.com/lelandrichardson/react-native-mock/issues/23
config.ignore = function babelIgnore(filename) {
  if (!(/\/node_modules\//).test(filename)) {
    return false; // if not in node_modules, we want to compile it
  } else if ((/\/node_modules\/react-native.*\//).test(filename)) {
    // its RN source code, so we want to compile it
    return false;
  }

  // it's in node modules and NOT RN source code
  return true;
};

require('babel-register')(config);
require('react-native-mock/mock');
