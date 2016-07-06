import BaseGenerator from '../base';

module.exports = BaseGenerator.extend({
  constructor() {
    BaseGenerator.apply(this, arguments);
  },

  prompting() {
    const done = this.async();
    const availableGenerators = [
      {name: 'Component', value: 'component'},
      {name: 'Container', value: 'container'}
    ];

    return this.prompt([{
      type: 'list',
      choices: availableGenerators,
      name: 'generator',
      message: 'Choose the generator to use',
      default: availableGenerators[0].value
    }], answers => {
      this.composeWith(`rn:${answers.generator}`, {},
        {local: require.resolve(`../${answers.generator}`)}
      );
      done();
    });
  }
});
