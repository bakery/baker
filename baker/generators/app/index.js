/* eslint max-len: "off" */
/* globals which: false */

import BaseGenerator from '../base';
import 'shelljs/global';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.applicationName = this.options.name;

    if (!this.applicationName) {
      // Use current directory name as the app name
      this.applicationName = path.basename(this.destinationPath('./'));
    }

    this.applicationName = this.namingConventions.applicationName.clean(this.applicationName);
  },

  initializing() {
    // XX: check if current directory has smth resembling a bootstrapped RN application
    if (this._currentDirectoryHasRNApp()) {
      this._abortSetup();
    }

    if (!this._checkIfRNIsInstalled()) {
      this.env.error('No React Native found: start by installing it https://facebook.github.io/react-native/docs/getting-started.html#quick-start');
    }

    this.originalDestination = this.destinationPath('.');
  },

  writing: {
    appPackageJSON() {
      this.template('package.json.hbs', `${this.appDirectory}/package.json`, {
        applicationName: this.applicationName,
      });
    },

    serverFiles() {
      this.bulkDirectory('server', this.serverDirectory);
    },
  },

  install: {
    installAppDepsAndRunRNSetup() {
      execSync('npm install', {
        cwd: this.destinationPath(this.appDirectory),
      });
      this._initRN();

      if (this.originalDestination !== this.destinationPath('.')) {
        this.destinationRoot(this.originalDestination);
      }

      execSync('npm install', {
        cwd: this.destinationPath(this.serverDirectory),
      });
    },
  },

  end() {
    if (this.originalDestination !== this.destinationPath('.')) {
      this.destinationRoot(this.originalDestination);
    }

    this.conflicter.force = true;

    ['ios', 'android'].forEach(platform => {
      this.template('index.js.hbs', `${this.appDirectory}/index.${platform}.js`,
        {
          applicationName: this.applicationName,
        }
      );
    });

    this.bulkDirectory('src', `${this.appDirectory}/src`);
    this.bulkDirectory('settings', this.appSettingsDirectory);
    // XX: make sure production settings never get checked into the repository
    this.write(`${this.appDirectory}/settings/production/.gitignore`, '*');
    // link to app settings from the project root
    execSync(`ln -s ${this.appDirectory}/settings ./settings`, {
      cwd: this.destinationPath('.'),
    });


    this.composeWith('component', {
      options: {
        componentName: 'App',
        boilerplateName: 'Vanila',
        platformSpecific: false,
      },
    }, {
      local: require.resolve('../component'),
    });

    this.composeWith('model', {
      options: {
        modelName: 'Example',
      },
    }, {
      local: require.resolve('../model'),
    });

    // Setup Fastlane jazz
    this.template('fastlane/Gemfile', `${this.appDirectory}/fastlane/Gemfile`);
    this.template('fastlane/Fastfile', `${this.appDirectory}/fastlane/Fastfile`, {
      applicationName: this.applicationName,
    });
    this.template('fastlane/Matchfile', `${this.appDirectory}/fastlane/Matchfile`);

    // Put default icons and splash images
    // into ios project
    this.bulkDirectory('AppIcon.appiconset',
      `${this.appDirectory}/ios/${this.applicationName}/Images.xcassets/AppIcon.appiconset`);
    this.bulkDirectory('LaunchImage.launchimage',
      `${this.appDirectory}/ios/${this.applicationName}/Images.xcassets/LaunchImage.launchimage`);
  },

  _checkIfRNIsInstalled() {
    return which('react-native');
  },

  _initRN() {
    this.spawnCommandSync('node', [
      this.templatePath('setup-rn.js'),
      this.destinationRoot('app'),
      this.applicationName,
    ]);
  },

  _currentDirectoryHasRNApp() {
    try {
      ['android', 'ios', 'index.ios.js', 'index.android.js'].forEach(f => fs.statSync(this.destinationPath(f)));
      return true;
    } catch (e) {
      return false;
    }
  },

  _abortSetup() {
    this.env.error('Yo! Looks like you are trying to run the app generator in a directory that already has a RN app.');
  },
});
