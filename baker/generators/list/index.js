import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor(...args) {
    BaseGenerator.apply(this, args);
  },

  prompting() {
    const done = this.async();
    const availableGenerators = [
      { name: 'Component', value: 'component' },
      { name: 'Container', value: 'container' },
      { name: 'Navigation', value: 'navigation' },
    ];

    return this.prompt([{
      type: 'list',
      choices: availableGenerators,
      name: 'generator',
      message: 'Choose the generator to use',
      default: availableGenerators[0].value,
    }], answers => {
      this.composeWith(`rn:${answers.generator}`, {},
        { local: require.resolve(`../${answers.generator}`) }
      );
      done();
    });
  },
});
