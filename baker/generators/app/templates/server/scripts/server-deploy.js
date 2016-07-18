import path from 'path';
import { execSync as run } from 'child_process';
import settings from '../../settings/production/base';

console.log('deploying jazz with', settings);

const settingsString = Object.keys(settings).reduce(
  (previousValue, currentValue) => `${previousValue} ${currentValue}=${settings[currentValue]}`,
  ''
);

console.log('settings: ', settingsString);

run(`heroku config:set ${settingsString}`);
run('git subtree push --prefix server heroku master', {
  cwd: path.resolve('..'),
});
