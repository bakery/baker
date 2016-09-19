/* eslint no-console: "off" */

// Attempt to run actual npm run setup to make sure all the jazz gets properly bootstrapped
// - get rid of current node_modules dir
// - reinstall deps
// - run app generator
// - bundle app using React Native bundle to check if the build works

const run = require('child_process').execSync;
const packageJSON = require('../../package');

const packageName = packageJSON.name;


// XX: only try running setup tests if we are testing original
// boilerplate package (baker) and not the app built on top of it
if (packageName === 'baker') {
  console.log('running app generator...', process.cwd());
  // eslint-disable-next-line max-len
  const r = run('./node_modules/babel-cli/bin/babel-node.js --presets es2015 ./.baker/generate.js app TestApplication');
  console.log(r.toString());
} else {
  console.log('skipping setup tests since this is the app based on baker');
}

console.log('building for iOS...');

// eslint-disable-next-line max-len
run('react-native bundle --entry-file index.ios.js --platform ios --bundle-output ./bundle.ios.js', { cwd: './app' });

console.log('building for Android...');

// eslint-disable-next-line max-len
run('react-native bundle --entry-file index.android.js --platform android --bundle-output ./bundle.android.js', { cwd: './app' });
