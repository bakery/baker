import _ from 'lodash';
import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.reducerName = options.reducerName;
    this.boilerplateName = options.boilerplateName || 'Vanila';
    this.skipActions = options.skipActions;
    this.skipTests = options.skipTests;
  },

  prompting() {
    const prompts = [];

    if (!this.reducerName) {
      prompts.push({
        type: 'input',
        name: 'reducerName',
        message: 'What should your reducer be called?',
        default: 'newReducer',
        validate: value => this.namingConventions.reducerName.regEx.test(value),
      });
    }

    if (prompts.length !== 0) {
      const done = this.async();
      this.prompt(prompts).then(answers => {
        this.reducerName = this.namingConventions.reducerName.clean(answers.reducerName);
        done();
      });
    }
  },

  configuring: {
    containerName() {
      this.reducerName = this.namingConventions.reducerName.clean(
        this.reducerName);
    },

    files() {
      this.files = [
        'reducer.js.hbs',
      ];

      if (!this.skipActions) {
        this.files.push('actions.js.hbs');
      }

      if (!this.skipTests) {
        this.files = [
          ...this.files,
          'test/actions.test.js.hbs',
          'test/reducer.test.js.hbs',
        ];
      }
    },

    boilerplate() {
      this.boilerplate = this._renderBoilerplate(this.boilerplateName);
    },
  },

  writing: {
    everything() {
      this.runBoilerplateBeforeHook(this.boilerplateName);

      this.files.forEach(
        f => this.template(
          f,
          `${this.appDirectory}/src/state/${this.reducerName}/${this._dropHBSExtension(f)}`
        )
      );

      this.runBoilerplateAfterHook(this.boilerplateName);
    },

    updateRootReducersModule() {
      const reducersModulePath = `${this.appDirectory}/src/state/reducers.js`;
      let reducersModuleContent;
      let reducersModule;

      if (this._fileExists(this.destinationPath(reducersModulePath))) {
        reducersModuleContent = this._readFile(reducersModulePath);
      } else {
        reducersModuleContent = this.read(this.templatePath('reducers.js.hbs'));
      }

      try {
        // reducersModule = esprima.parse(reducersModuleContent, this.esprimaOptions);
        reducersModule = this.parseJSSource(reducersModuleContent);
      } catch (e) {
        const path = this.destinationPath(reducersModulePath);
        this.env.error(`There seems to be an issue with your reducers module (${path})`, e);
        return;
      }

      // add import statement to the top of the
      // reducers module including new reducer
      reducersModule.body = [{
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: `${this.reducerName}`,
            },
            imported: {
              type: 'Identifier',
              name: `${this.reducerName}`,
            },
          },
        ],
        source: {
          type: 'Literal',
          value: `./${this.reducerName}/reducer`,
          raw: `'./${this.reducerName}/reducer'`,
        },
      }, ...reducersModule.body];

      // add new reducer to the module export
      // find top level var called applicationReducers
      // add new reducer to init.properties

      const applicationReducersVar = _.find(reducersModule.body,
        d => d.type === 'VariableDeclaration' && d.declarations[0].id.name === 'applicationReducers'
      );

      if (applicationReducersVar) {
        applicationReducersVar.declarations[0].init.properties.push({
          type: 'Property',
          key: {
            type: 'Identifier',
            name: this.reducerName,
          },
          computed: false,
          value: {
            type: 'Identifier',
            name: this.reducerName,
          },
          kind: 'init',
          method: false,
          shorthand: false,
        });
      } else {
        // XX: this should not happen normally
        // unless applicationReducers got moved somewhere, deleted
        this.env.error('Your reducers.js module is missing applicationReducers var');
        return;
      }

      try {
        this.generateJSFile(reducersModule, reducersModulePath);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error generating reducers.js', e);
      }
    },
  },
});
