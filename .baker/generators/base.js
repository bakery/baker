import yeoman from 'yeoman-generator';
import _ from 'lodash';
import changeCase from 'change-case';
import fs from 'fs';
import Handlebars from 'handlebars';
import shell from 'shelljs';
import { execSync } from 'child_process';
import { generateJSFileContent } from './escodegen';
import { parseJSSource } from './esprima';
import namingConventions from './naming';

module.exports = yeoman.Base.extend({
  constructor(...args) {
    yeoman.Base.apply(this, args);

    // eslint-disable-next-line global-require
    const boilerplates = require('./boilerplates');

    this.runBoilerplateHook = boilerplates.runBoilerplateHook;
    this.runBoilerplateBeforeHook = boilerplates.runBoilerplateBeforeHook;
    this.runBoilerplateAfterHook = boilerplates.runBoilerplateAfterHook;

    this.appDirectory = 'app';
    this.serverDirectory = 'server';
    this.appSettingsDirectory = `${this.appDirectory}/settings`;
    this.platforms = ['ios', 'android'];
    this.namingConventions = namingConventions;
    this.Handlebars = Handlebars;
    // XX: navigation generator needs these to
    // list available navigation boilerplates
    // since they are explicitly excluded from component generator
    this.navigationBoilerplates = [
      'navigation/Cards',
      'navigation/Tabs',
    ];

    this.Handlebars.registerHelper('uppercaseFirst', text => changeCase.upperCaseFirst(text));
    this.Handlebars.registerHelper('pascalCase', text => changeCase.pascalCase(text));
    this.Handlebars.registerHelper('camelCase', text => changeCase.camelCase(text));
    this.Handlebars.registerHelper('constantCase', text => changeCase.constantCase(text));

    this.template = (source, destination, data) => {
      // XX: override Yo's standard template method to use Handlebars templates
      const template = Handlebars.compile(this.read(source));
      const content = template(_.extend({}, this, data || {}));
      this.write(destination, content);
    };

    this.parseJSSource = content => parseJSSource(content);

    this.generateJSFile = (ast, path) => {
      // this.conflicter.force = true;
      this.write(path, generateJSFileContent(ast));
    };

    this.installNPMPackage = (packageName, options = { save: true }) => {
      const ops = options.saveDev ? '--save-dev' : '--save';
      execSync(`npm install ${ops} ${packageName}`, {
        cwd: this.destinationPath(this.appDirectory),
        stdio: 'inherit',
      });
    };

    this.linkRNPMPackage = (packageName) => {
      execSync(`react-native link ${packageName}`, {
        cwd: this.destinationPath(this.appDirectory),
        stdio: 'inherit',
      });
    };
  },

  _fileExists(fullFilePath) {
    try {
      fs.statSync(fullFilePath);
      return true;
    } catch (e) {
      return false;
    }
  },

  _readFile(fullFilePath) {
    return fs.readFileSync(fullFilePath).toString();
  },

  _dropHBSExtension(fileName) {
    const parts = fileName.split('.hbs');
    return parts.length === 2 ? parts[0] : fileName;
  },

  _listAvailableBoilerPlates() {
    const excludeBoilerplates = [...this.navigationBoilerplates];
    const boilerplatesPath = this.templatePath('./boilerplates');

    const boilerplates = _.uniq(
      shell.find(boilerplatesPath).filter(file => file.match(/\.js.hbs$/i))
        .map(file => (/\/([a-zA-Z0-9\/]+)(\.ios|\.android)?\.js\.hbs$/ig).exec(
          file.split(boilerplatesPath)[1])[1]
        )
    );

    return boilerplates.filter(b => excludeBoilerplates.indexOf(b) === -1);
  },

  _renderBoilerplate(boilerplate, platform, fallbackBoilerplate = 'Vanila') {
    let template;
    try {
      // see if there's a boiler plate for this specific platorm
      template = this.read(`./boilerplates/${boilerplate}.${platform}.js.hbs`);
    } catch (e) {
      try {
        template = this.read(`./boilerplates/${boilerplate}.js.hbs`);
      } catch (anotherE) {
        if (fallbackBoilerplate !== boilerplate) {
          // eslint-disable-next-line no-console
          console.log(
            `failed to locate ${boilerplate} boilerplate. Falling back to ${fallbackBoilerplate}`
          );
          return this._renderBoilerplate(fallbackBoilerplate, platform);
        }

        throw anotherE;
      }
    }

    return Handlebars.compile(template)(this);
  },

  _isBoilerplatePlatformSpecific(boilerplate) {
    try {
      this.platforms.forEach(platform => {
        fs.statSync(this.templatePath(`./boilerplates/${boilerplate}.${platform}.js.hbs`));
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  dummyMethod() {
    // XX: keep this here so tests can run against base generator
  },
});
