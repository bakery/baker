import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.componentName = options.componentName;
    this.isContainer = options.isContainer;
    this.componentName = options.componentName;
    this.boilerplateName = options.boilerplateName;
    this.addReducer = options.addReducer;
    this.platformSpecific = options.platformSpecific;

    if (options.destinationRoot) {
      this.destinationRoot(options.destinationRoot);
    }

    this.Handlebars.registerPartial('mapDispatchAndPropsAndConnect',
      this.read(this.templatePath('partials/mapDispatchPropsAndConnect.js.hbs'))
    );
  },

  prompting() {
    const done = this.async();
    const prompts = [];

    if (!this.componentName) {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: 'What should your component be called?',
        default: 'MyNewComponent',
        validate: value => this.namingConventions.componentName.regEx.test(value),
      });
    }

    if (!this.boilerplateName) {
      prompts.push({
        type: 'list',
        name: 'boilerplateName',
        message: 'Which boilerplate do you want to use?',
        default: 'Vanila',
        choices: () => this._listAvailableBoilerPlates(),
      });
    }

    if (typeof this.platformSpecific === 'undefined') {
      prompts.push({
        type: 'confirm',
        name: 'platformSpecific',
        message: 'Do you separate versions of this component for iOS and Android?',
        when: answers => {
          const boilerplateName = this.boilerplateName || answers.boilerplateName;
          return !this._isBoilerplatePlatformSpecific(boilerplateName);
        },
        default: false,
      });
    }

    if (prompts.length === 0) {
      done();
      return;
    }

    this.prompt(prompts, answers => {
      if (answers.componentName) {
        this.componentName = answers.componentName;
      }

      if (typeof answers.platformSpecific !== 'undefined') {
        this.platformSpecific = answers.platformSpecific;
      }

      if (answers.boilerplateName) {
        this.boilerplateName = answers.boilerplateName;
      }

      done();
    });
  },

  configuring: {
    platforms() {
      if (this._isBoilerplatePlatformSpecific(this.boilerplateName)) {
        this.platformSpecific = true;
      }
    },

    files() {
      this.componentName = this.namingConventions.componentName.clean(
        this.componentName
      );

      this.files = [
        'test.js.hbs',
        'styles.js.hbs',
      ];
    },

    reducer() {
      this.reducerName = this.namingConventions.reducerName.clean(
        this.componentName
      );
    },

    selector() {
      if (this.addReducer) {
        this.selectorName = this.namingConventions.selectorName.clean(
          this.componentName
        );
      }
    },
  },

  writing: {
    reducer() {
      if (this.addReducer) {
        this.composeWith('rn:reducer', {
          options: {
            container: this.componentName,
            boilerplateName: this.boilerplateName,
          },
        }, {
          local: require.resolve('../reducer'),
        });
      }
    },

    everything() {
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/components/${this.componentName}/${this._dropHBSExtension(f)}`);
      });

      if (this.platformSpecific) {
        this.platforms.forEach(platform => {
          const path = `${this.appDirectory}/components/${this.componentName}/index.${platform}.js`;
          this.template('index.js.hbs', path,
            Object.assign({}, this, {
              boilerplate: this._renderBoilerplate(this.boilerplateName, platform),
            })
          );
        });
      } else {
        const path = `${this.appDirectory}/components/${this.componentName}/index.js`;
        this.template('index.js.hbs', path,
          Object.assign({}, this, {
            boilerplate: this._renderBoilerplate(this.boilerplateName),
          })
        );
      }
    },
  },
});
