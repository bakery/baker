import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  prompting() {
    const done = this.async();
    const availableBoilerplates = this.navigationBoilerplates;
    const prompts = [
      {
        type: 'input',
        name: 'componentName',
        message: 'What should your container be called?',
        default: 'Navigation',
        validate: value => this.namingConventions.componentName.regEx.test(value),
      },
      {
        type: 'list',
        name: 'boilerplateName',
        message: 'Which boilerplate do you want to use?',
        default: availableBoilerplates[0],
        choices: availableBoilerplates,
      },
    ];

    this.prompt(prompts).then(answers => {
      this.componentName = answers.componentName;
      this.boilerplateName = answers.boilerplateName;
      done();
    });
  },

  writing: {
    container() {
      this.composeWith('rn:container', {
        options: {
          name: this.componentName,
          boilerplateName: this.boilerplateName,
          doNotGenerateTests: true,
          reducerOptions: {
            skipActions: true,
            skipTests: true,
          },
        },
      }, {
        local: require.resolve('../container'),
      });
    },
  },
});
