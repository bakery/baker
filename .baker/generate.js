var argv = require('minimist')(process.argv.slice(2));
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();
var supportedCommands = ['generate','generate:app'];

var generators = [
  'app', 'component', 'container', 'list', 'reducer'
];

function runCommand() {
  console.log('@@ running generator');
  
  generators.forEach(generator => {
    env.register(`./.baker/generators/${generator}`, `rn:${generator}`); 
  });

  env.run('rn:component');
}

runCommand();
