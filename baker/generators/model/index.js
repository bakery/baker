import BaseGenerator from '../base';


module.exports = BaseGenerator.extend({
  constructor(args, options) {
    BaseGenerator.call(this, args, options);

    this.modelName = options.modelName;
  },

  prompting() {
    const prompts = [];

    if (!this.modelName) {
      prompts.push({
        type: 'input',
        name: 'modelName',
        message: 'What should your model be called?',
        default: 'Todo',
        validate: value => this.namingConventions.modelName.regEx.test(value),
      });
    }

    if (prompts.length !== 0) {
      const done = this.async();
      this.prompt(prompts, answers => {
        if (!this.modelName) {
          this.modelName = answers.modelName;
        }
        done();
      });
    }
  },

  writing: {
    serverModel() {
      this.template('server/models/index.js.hbs',
        `${this.serverDirectory}/models/${this.modelName}.js`);
    },

    updateGraphQLSchemaFile() {
      const graphQLSchemaModulePath = `${this.serverDirectory}/graphql/schema.js`;
      let schemaModuleContent;
      let schemaModule;

      if (this._fileExists(this.destinationPath(graphQLSchemaModulePath))) {
        schemaModuleContent = this._readFile(graphQLSchemaModulePath);
      } else {
        schemaModuleContent = this.read(this.templatePath('schema.js.hbs'));
      }

      try {
        schemaModule = this.parseJSSource(schemaModuleContent);
      } catch (e) {
        const path = this.destinationPath(graphQLSchemaModulePath);
        this.env.error(`There seems to be an issue with your reducers module (${path})`, e);
        return;
      }

      console.log(JSON.stringify(schemaModule));

      // add import statement for the new model
      schemaModule.body = [{
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: `${this.modelName}`,
            },
            imported: {
              type: 'Identifier',
              name: `${this.modelName}`,
            },
          },
        ],
        source: {
          type: 'Literal',
          value: `../models/${this.modelName}`,
          raw: `'../models/${this.modelName}'`,
        },
      }, ...schemaModule.body];

      try {
        this.generateJSFile(schemaModule, graphQLSchemaModulePath);
      } catch (e) {
        console.error('error generating reducers.js', e);
      }
    },
  },
});
