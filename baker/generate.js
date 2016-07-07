import yeoman from 'yeoman-environment';

const argv = require('minimist')(process.argv.slice(2));
const env = yeoman.createEnv();
const generators = [
  'app', 'component', 'container', 'list', 'reducer', 'navigation',
];
const supportedCommands = ['app'];

generators.forEach(g => env.register(`./baker/generators/${g}`, `rn:${g}`));

function defaultCommand() {
  env.run('rn:list');
}

function runCommand() {
  if (argv._.length !== 0) {
    const command = argv._[0];

    if (supportedCommands.indexOf(command) === -1) {
      return;
    }

    switch (command) {
      case 'app':
        env.run('rn', { baker: 'baker' });
        break;
      default:
        defaultCommand();
    }
  } else {
    defaultCommand();
  }
}

runCommand();
