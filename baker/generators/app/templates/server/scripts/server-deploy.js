/* eslint global-require: "off" */

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

console.log('Deploying with settings:', JSON.stringify(settings, null, ' '));

try {
  run(`git ls-remote ${serverGitRemote}`);
} catch (e) {
  // eslint-disable-next-line max-len
  console.log(`${serverGitRemote} git remote is not set. Try: git remote add ${serverGitRemote} <heroku_app_git_url>`);
  process.exit(1);
}

run(`heroku config:set APPLICATION_SETTINGS='${JSON.stringify(settings)}'`);
run('git subtree push --prefix server heroku master', {
  cwd: path.resolve('..'),
});
