#!/usr/bin/env node

var run = require('child_process').execSync;
var npmVersion = run('npm --version').toString();
var rx = new RegExp(/([0-9]+)\.[0-9]+\.[0-9]+/ig)

var version = rx.exec(npmVersion);
var validVersion = version && version.length === 2
  && version[1] && (parseInt(version[1], 10) >= 3);

if (validVersion) {
  process.exit(0);
  return;
} else {
  console.log(
    'Baker requires npm 3+. Consider updating to the latest stable version of npm: ' +
    'https://github.com/npm/npm/wiki/Troubleshooting#try-the-latest-stable-version-of-npm'
  );
  process.exit(1);
}