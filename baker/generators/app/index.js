/* eslint max-len: "off" */
/* globals which: false */

import BaseGenerator from '../base';
import yosay from 'yosay';
import 'shelljs/global';
import fs from 'fs';
import { execSync } from 'child_process';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.applicationName = this.options.name;
    this.addServer = this.options.addServer;
  },

  initializing() {
    // XX: check if current directory has smth resembling a bootstrapped RN application
    if (this._currentDirectoryHasRNApp()) {
      this._abortSetup();
    }

    if (!this._checkIfRNIsInstalled()) {
      this.env.error('No React Native found: start by installing it https://facebook.github.io/react-native/docs/getting-started.html#quick-start');
    }

    this.log(yosay(
      'Welcome to the sublime Reactive Native generator!'
    ));

    this.option('baker');

    this.originalDestination = this.destinationPath('.');
  },

  prompting() {
    const prompts = [];

    this.applicationName = this.options.name;

    if (!this.applicationName) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'What should your app be called?',
        default: 'MyReactApp',
        validate: value => (/^[$A-Z_][0-9A-Z_$]*$/i).test(value),
      });
    }

    if (typeof this.addServer === 'undefined') {
      prompts.push({
        type: 'confirm',
        name: 'addServer',
        message: 'Do you want a Parse Server setup for this app?',
        default: true,
      });
    }

    if (prompts.length !== 0) {
      const done = this.async();
      this.prompt(prompts, answers => {
        if (typeof this.applicationName === 'undefined') {
          this.applicationName = answers.name;
        }

        if (typeof this.addServer === 'undefined') {
          this.addServer = answers.addServer;
        }

        done();
      });
    }
  },

  makeSureDestinationDirectoryIsNotOccupiedAlready() {
    // check to see if destination directory is empty or not
    // if it's empty -> go ahead and do the thing
    // if not empty -> create a folder and use it as cwd
    // except if this.options.baker is on

    const filesInDestinationDirectory = fs.readdirSync(this.destinationPath('.'));
    if (filesInDestinationDirectory.length !== 0 && !this.options.baker) {
      fs.mkdirSync(this.destinationPath(this.applicationName));
      this.destinationRoot(this.destinationPath(this.applicationName));
    }
  },

  writing: {
    appPackageJSON() {
      this.template('package.json.hbs', `${this.appDirectory}/package.json`, {
        applicationName: this.applicationName,
      });
    },

    serverFiles() {
      if (!this.addServer) {
        return;
      }

      this.bulkDirectory('server', this.serverDirectory);
      this.bulkDirectory('settings', this.settingsDirectory);

      this.composeWith('model', {
        options: {
          modelName: 'Example',
        },
      }, {
        local: require.resolve('../model'),
      });
    },
  },

  install: {
    installAppDepsAndRunRNSetup() {
      console.log('destination is', this.destinationPath('.'));

      execSync('npm install', {
        cwd: this.destinationPath(this.appDirectory),
      });
      this._initRN();
    },
  },

  end() {
    if (this.originalDestination !== this.destinationPath('.')) {
      this.destinationRoot(this.originalDestination);
    }

    console.log('destination is', this.destinationPath('.'));

    this.conflicter.force = true;

    ['ios', 'android'].forEach(platform => {
      this.template('index.js.hbs', `${this.appDirectory}/index.${platform}.js`,
        {
          applicationName: this.applicationName,
        }
      );
    });

    this.bulkDirectory('src', `${this.appDirectory}/src`);

    this.composeWith('component', {
      options: {
        componentName: 'App',
        // destinationRoot: this.destinationPath('.'),
        boilerplateName: 'Vanila',
        platformSpecific: false,
      },
    }, {
      local: require.resolve('../component'),
    });
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
