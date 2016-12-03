import changeCase from 'change-case';
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
      this.prompt(prompts).then(answers => {
        if (!this.modelName) {
          this.modelName = answers.modelName;
        }
        done();
      });
    }
  },

  writing: {
    serverModel() {
      this.template('server/models/model.js.hbs', `${this.serverDirectory}/src/api/${this.modelName}/model.js`);
      this.template('server/models/resolver.js.hbs', `${this.serverDirectory}/src/api/${this.modelName}/resolver.js`);
      this.template('server/models/schema.js.hbs', `${this.serverDirectory}/src/api/${this.modelName}/schema.js`);
    },

    updateGraphQLSchemaFile() {
      const graphQLSchemaModulePath = `${this.serverDirectory}/src/api/schema.js`;
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
        this.env.error(`There seems to be an issue with your schema module (${path})`, e);
        return;
      }

      // add import statements for the new model: include schema + resolvers
      schemaModule.body = [{
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: `${this.modelName}Schema`,
            },
            imported: {
              type: 'Identifier',
              name: `${this.modelName}Schema`,
            },
          },
        ],
        source: {
          type: 'Literal',
          value: `./${this.modelName}/schema`,
          raw: `'./${this.modelName}/schema'`,
        },
      }, {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: `${this.modelName}Resolvers`,
            },
            imported: {
              type: 'Identifier',
              name: `${this.modelName}Resolvers`,
            },
          },
        ],
        source: {
          type: 'Literal',
          value: `./${this.modelName}/resolver`,
          raw: `'./${this.modelName}/resolver'`,
        },
      }, ...schemaModule.body];

      // include schema of a newly created model in graphql/schema module
      const queriesDeclaration = schemaModule.body.find(
        i => i.type === 'VariableDeclaration' && i.declarations &&
          i.declarations[0] && i.declarations[0].id.name === 'schemas'
      );

      if (!queriesDeclaration) {
        // eslint-disable-next-line max-len
        this.env.error(`Your ${this.serverDirectory}/src/api/schema.js module is missing schemas const`);
      }

      queriesDeclaration.declarations[0].init.elements.push({
        type: 'Identifier',
        name: `${this.modelName}Schema`
      });

      // include resolvers of a newly created model in graphql/schema module
      const resolversDeclaration = schemaModule.body.find(
        i => i.type === 'VariableDeclaration' && i.declarations &&
          i.declarations[0] && i.declarations[0].id.name === 'resolvers'
      );

      if (!resolversDeclaration) {
        // eslint-disable-next-line max-len
        this.env.error(`Your ${this.serverDirectory}/src/api/schema.js module is missing resolvers const`);
      }

      resolversDeclaration.declarations[0].init.elements.push({
        type: 'Identifier',
        name: `${this.modelName}Resolvers`
      });

      try {
        this.generateJSFile(schemaModule, graphQLSchemaModulePath);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`error generating ${this.serverDirectory}/src/graphql/schema.js`, e);
      }
    },
  },
});
