/* eslint global-require: "off" */

import assert from 'assert';
import path from 'path';
import { execSync as run } from 'child_process';

const serverGitRemote = 'heroku';
const settingsModulePath = '../../settings/production/base';
let settings;

try {
  settings = require(settingsModulePath);
} catch (e) {
  console.log(`Cannot load settings module from ${path.resolve(settingsModulePath)}.js`);
  process.exit(1);
}

// Make sure settings are flat
// Good: { setting1: 'hello', setting2: 'world' }
// Bad: { setting1: { subsetting: 'hello', key: 'world' } }
Object.keys(settings).forEach(k => {
  assert(typeof settings[k] !== 'object', 'settings cannot have embedded objects/arrays');
});


console.log('Deploying with settings:', JSON.stringify(settings, null, ' '));

try {
  run(`git ls-remote ${serverGitRemote}`);
} catch (e) {
  // eslint-disable-next-line max-len
  console.log(`${serverGitRemote} git remote is not set. Try: git remote add ${serverGitRemote} <heroku_app_git_url>`);
  process.exit(1);
}

const settingsString = Object.keys(settings).reduce(
  (previousValue, currentValue) => `${previousValue} ${currentValue}=${settings[currentValue]}`,
  ''
);

// run(`heroku config:set ${settingsString}`);
run('git subtree push --prefix server heroku master', {
  cwd: path.resolve('..'),
});
