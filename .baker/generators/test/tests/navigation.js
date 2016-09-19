import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
const navigationGeneratorModule = path.join(__dirname, '../../navigation');
const appDirectory = 'app';
const componentName = 'Navigation';
const boilerplateName = 'navigation/Cards';
let composeWithSpy;

describe('generator-rn:navigation', () => {
  let _generator = null;

  before(done => {
    helpers.run(navigationGeneratorModule)
      .withPrompts({
        componentName,
        boilerplateName,
      })
      .on('ready', generator => {
        _generator = generator;
        composeWithSpy = sinon.spy(generator, 'composeWith');
      })
      .on('end', done);
  });

  after(() => {
    composeWithSpy && composeWithSpy.restore();
  });

  it('is defined', () => {
    expect(_generator).to.be.ok;
  });

  it('composes with container generator', () => {
    const firstComposeArgs = composeWithSpy.getCall(0).args;
    const generatorName = firstComposeArgs[0];
    const options = firstComposeArgs[1].options;

    expect(generatorName).to.eql('rn:container');
    expect(options.name).to.eql(componentName);
    expect(options.boilerplateName).to.eql(boilerplateName);
    expect(options.doNotGenerateTests).to.eql(true);
    expect(options.reducerOptions.skipActions).to.eql(true);
    expect(options.reducerOptions.skipTests).to.eql(true);
  });
});
