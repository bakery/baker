/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';

const expect = chai.expect;
const containerGeneratorModule = path.join(__dirname, '../../container');
let composeWithSpy;

describe('generator-rn:container', () => {
  const containerName = 'MyContainer';
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const containerModule = `${appDirectory}/src/components/${containerName}/index.js`;
  const stylesheetModule = `${appDirectory}/src/components/${containerName}/styles.js`;

  describe('container with new reducer', () => {
    const newReducerName = 'todos';

    before(done => {
      helpers.run(containerGeneratorModule)
        .withPrompts({
          containerName,
          reducerName: 'Create New Reducer',
          newReducerName,
        }).on('ready', generator => {
          composeWithSpy = sinon.spy(generator, 'composeWith');
        }).on('end', done);
    });

    after(() => {
      composeWithSpy && composeWithSpy.restore();
    });

    it('sets up all container jazz', () => {
      assert.file([
        'index.js',
        'index.test.js',
      ].map(f => `${appDirectory}/src/components/${containerName}/${f}`));
    });

    it('composes with reducer generator', () => {
      const firstComposeArgs = composeWithSpy.getCall(0).args;
      expect(firstComposeArgs[0]).to.eql('rn:reducer');
      expect(firstComposeArgs[1].options.reducerName).to.eql(newReducerName);
    });

    it('composes with component generator', () => {
      const secondComposeArgs = composeWithSpy.getCall(1).args;
      expect(secondComposeArgs[0]).to.eql('rn:component');
      expect(secondComposeArgs[1].options.reducerName).to.equal(newReducerName);
      expect(secondComposeArgs[1].options.componentName).to.equal(containerName);
      expect(secondComposeArgs[1].options.isContainer).to.equal(true);
    });
  });

  describe('container with an existing reducer', () => {
    before(done => {
      helpers.run(containerGeneratorModule).withOptions({
      }).withPrompts({
        containerName,
        reducerName: 'todos',
      }).on('ready', generator => {
        composeWithSpy = sinon.spy(generator, 'composeWith');
      })
      .on('end', done);
    });

    after(() => {
      composeWithSpy && composeWithSpy.restore();
    });

    it('composes with component generator', () => {
      const secondComposeArgs = composeWithSpy.getCall(0).args;
      expect(secondComposeArgs[0]).to.eql('rn:component');
      expect(secondComposeArgs[1].options.componentName).to.equal(containerName);
      expect(secondComposeArgs[1].options.isContainer).to.equal(true);
      expect(secondComposeArgs[1].options.reducerName).to.equal('todos');
    });
  });

  describe('container-reducer interaction', () => {
    const reducerOptions = {
      reducerOption1: 'reducerOption1',
      reducerOption2: 'reducerOption2',
    };

    const reducerName = 'todos';

    before(done => {
      helpers.run(containerGeneratorModule).withOptions({
        reducerOptions,
      }).withPrompts({
        containerName,
        reducerName: 'Create New Reducer',
        newReducerName: reducerName,
      }).on('ready', generator => {
        composeWithSpy = sinon.spy(generator, 'composeWith');
      })
      .on('end', done);
    });

    after(() => {
      composeWithSpy && composeWithSpy.restore();
    });

    it('passes reducer option down to reducer generator', () => {
      const firstComposeArgs = composeWithSpy.getCall(0).args;

      expect(firstComposeArgs[0]).to.eql('rn:reducer');
      expect(firstComposeArgs[1].options.reducerName).to.eql(reducerName);
      expect(firstComposeArgs[1].options.reducerOption1).to.eql('reducerOption1');
      expect(firstComposeArgs[1].options.reducerOption2).to.eql('reducerOption2');
    });
  });
});
