var argv = require('minimist')(process.argv.slice(2));
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();
var supportedCommands = ['generate','generate:app'];

var generators = [
  'app', 'component', 'container', 'list', 'reducer'
];

generators.forEach(function(generator) {
  env.register('./.baker/generators/' + generator, 'rn:' + generator); 
})

function runCommand() {
  if (argv._.length !== 0) {
    var command = argv._[0];

    if (supportedCommands.indexOf(command) === -1) {
      return;
    }

    switch (command) {
      case 'app':
        env.run('rn', {baker: 'baker'});
        break;
    }
  } else {
    env.run('rn:list');
  }
}

runCommand();