/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mkdirp from 'mkdirp';
import fs from 'fs-extra';
import mockery from 'mockery';

const expect = chai.expect;
const reducerGeneratorModule = path.join(__dirname, '../../reducer');
const appDirectory = 'app';
const boilerplate = 'Vanila';
const reducerName = 'Todos';

const setupTest = (options, input) => {
  let runBoilerplateBeforeHookSpy;
  let runBoilerplateAfterHookSpy;

  before(done => {
    runBoilerplateBeforeHookSpy = sinon.spy();
    runBoilerplateAfterHookSpy = sinon.spy();

    mockery.enable();
    mockery.warnOnUnregistered(false);
    mockery.registerMock('./boilerplates', {
      runBoilerplateBeforeHook: runBoilerplateBeforeHookSpy,
      runBoilerplateAfterHook: runBoilerplateAfterHookSpy,
    });

    helpers.run(reducerGeneratorModule).withOptions(options)
      .withPrompts(input).on('end', done);
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('creates reducer files', () => {
    assert.file([
      'actions.js',
      'reducer.js',
      'test/reducer.test.js',
      'test/actions.test.js',
    ].map(f => `${appDirectory}/src/state/todos/${f}`));
  });

  it('updates root reducers file with new reducer info', () => {
    const reducersModulePath = `${appDirectory}/src/state/reducers.js`;
    assert.file(reducersModulePath);
    assert.fileContent(reducersModulePath,
      "import todos from './todos/reducer'"
    );
    assert.fileContent(reducersModulePath,
      'todos: todos'
    );
  });

  it('default exports newly created reducer ', () => {
    const reducerModulePath = `${appDirectory}/src/state/todos/reducer.js`;
    assert.fileContent(reducerModulePath,
      'export default todos'
    );
  });

  it('exports a selector for the newly created reducer ', () => {
    const reducerModulePath = `${appDirectory}/src/state/todos/reducer.js`;
    assert.fileContent(reducerModulePath,
      'export function selectTodos(state) {'
    );
  });

  it('calls boilerplate hooks', () => {
    expect(runBoilerplateBeforeHookSpy.calledOnce).to.be.ok;
    expect(runBoilerplateBeforeHookSpy.calledWith(boilerplate)).to.be.ok;
    expect(runBoilerplateAfterHookSpy.calledOnce).to.be.ok;
    expect(runBoilerplateAfterHookSpy.calledWith(boilerplate)).to.be.ok;
  });
};

describe('generator-rn:reducer', () => {
  describe('using inputs', () => {
    setupTest({
      boilerplateName: boilerplate,
    }, {
      appDirectory,
      reducerName,
    });
  });

  describe('using options', () => {
    setupTest({
      boilerplateName: boilerplate,
      reducerName,
    }, {});
  });
});
