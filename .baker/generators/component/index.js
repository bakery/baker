import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.isContainer = options.isContainer;
    this.componentName = options.componentName;
    this.boilerplateName = options.boilerplateName;
    this.platformSpecific = options.platformSpecific;
    this.doNotGenerateTests = options.doNotGenerateTests;
    this.reducerName = options.reducerName;

    if (this.reducerName) {
      this.selectorName = this.namingConventions.selectorName.clean(this.reducerName);
    }

    if (options.destinationRoot) {
      this.destinationRoot(options.destinationRoot);
    }

    this.Handlebars.registerPartial('mapDispatchAndPropsAndConnect',
      this.read(this.templatePath('partials/mapDispatchPropsAndConnect.js.hbs'))
    );

    this.Handlebars.registerPartial('declareComponent',
      this.read(this.templatePath('partials/declareComponent.js.hbs'))
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
        message: 'Do you need separate versions of this component for iOS and Android?',
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

    this.prompt(prompts).then(answers => {
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
        'styles.js.hbs',
      ];

      if (!this.platformSpecific && !this.doNotGenerateTests) {
        this.files.push('index.test.js.hbs');
      }
    },

    reducerDirectory() {
      this.reducerDirectory = this.namingConventions.reducerName.clean(this.reducerName);
    },
  },

  writing: {
    everything() {
      this.files.forEach(f => {
        this.template(f,
          `${this.appDirectory}/src/components/${this.componentName}/${this._dropHBSExtension(f)}`);
      });

      this.runBoilerplateBeforeHook(this.boilerplateName);

      if (this.platformSpecific) {
        this.platforms.forEach(platform => {
          const path = `${this.appDirectory}/src/components/${this.componentName}`;

          this.template('index.js.hbs', `${path}/index.${platform}.js`,
            Object.assign({}, this, {
              boilerplate: this._renderBoilerplate(this.boilerplateName, platform),
            })
          );

          if (!this.doNotGenerateTests) {
            this.template('index.test.js.hbs', `${path}/index.${platform}.test.js`,
              Object.assign({}, this, {
                platform,
              })
            );
          }
        });
      } else {
        const path = `${this.appDirectory}/src/components/${this.componentName}/index.js`;
        this.template('index.js.hbs', path,
          Object.assign({}, this, {
            boilerplate: this._renderBoilerplate(this.boilerplateName),
          })
        );
      }

      this.runBoilerplateAfterHook(this.boilerplateName);
    },
  },
});
