import BaseGenerator from '../base';
import { getAvailableReducers } from '../reducer/helpers';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);
    this.containerName = options.name;
    this.createNewReducer = false;
    this.boilerplateName = options.boilerplateName;
    this.reducerOptions = options.reducerOptions || {};
    this.doNotGenerateTests = options.doNotGenerateTests;
  },

  prompting() {
    const done = this.async();
    const prompts = [];
    const availableReducers = getAvailableReducers(
      this.destinationPath(`${this.appDirectory}/src/state/reducers.js`)
    );
    const createNewReducerOption = 'Create New Reducer';

    if (!this.containerName) {
      prompts.push({
        type: 'input',
        name: 'containerName',
        message: 'What should your container be called?',
        default: 'MyNewContainer',
        validate: value => this.namingConventions.componentName.regEx.test(value),
      });
    }

    prompts.push({
      type: 'list',
      name: 'reducerName',
      message: 'Which reducer do you want to use?',
      choices: [...availableReducers, createNewReducerOption],
    });

    prompts.push({
      type: 'input',
      name: 'newReducerName',
      message: 'Pick a name for a new reducer',
      when: answers => answers.reducerName === createNewReducerOption,
    });

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts).then(answers => {
      if (answers.containerName) {
        this.containerName = answers.containerName;
      }

      if (answers.reducerName === createNewReducerOption) {
        this.createNewReducer = true;
        this.reducerName = answers.newReducerName;
      } else {
        this.reducerName = answers.reducerName;
      }

      done();
    });
  },

  configuring: {
    containerName() {
      this.containerName = this.namingConventions.componentName.clean(this.containerName);
    },
  },

  writing: {
    reducer() {
      if (this.createNewReducer) {
        const reducerOptions = Object.assign({
          reducerName: this.reducerName,
          boilerplateName: this.boilerplateName,
        }, this.reducerOptions);

        this.composeWith('rn:reducer', {
          options: reducerOptions,
        }, {
          local: require.resolve('../reducer'),
        });
      }
    },

    component() {
      this.composeWith('rn:component', {
        options: {
          componentName: this.containerName,
          isContainer: true,
          reducerName: this.reducerName,
          boilerplateName: this.boilerplateName,
          doNotGenerateTests: this.doNotGenerateTests,
        },
      }, {
        local: require.resolve('../component'),
      });
    },
  },
});
