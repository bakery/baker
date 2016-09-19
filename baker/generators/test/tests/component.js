/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';
import mockery from 'mockery';

const expect = chai.expect;
const componentGeneratorModule = path.join(__dirname, '../../component');

describe('generator-rn:component', () => {
  const componentName = 'MyComponent';
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const componentModule = `${appDirectory}/src/components/${componentName}/index.js`;

  let runBoilerplateBeforeHookSpy;
  let runBoilerplateAfterHookSpy;


  describe('simple component', () => {
    before(done => {
      runBoilerplateBeforeHookSpy = sinon.spy();
      runBoilerplateAfterHookSpy = sinon.spy();

      mockery.enable();
      mockery.warnOnUnregistered(false);
      mockery.registerMock('./boilerplates', {
        runBoilerplateBeforeHook: runBoilerplateBeforeHookSpy,
        runBoilerplateAfterHook: runBoilerplateAfterHookSpy,
      });

      helpers.run(componentGeneratorModule)
      .withPrompts({
        componentName,
        boilerplateName: boilerplate,
      }).on('end', done);
    });

    after(() => {
      mockery.deregisterAll();
      mockery.disable();
    });

    it('sets up all component jazz', () => {
      assert.file([
        'index.js',
        'styles.js',
        'index.test.js',
      ].map(f => `${appDirectory}/src/components/${componentName}/${f}`));
    });

    it('exports component as-is without container wrapping', () => {
      assert.fileContent(componentModule, `export default ${componentName}`);
    });

    it('includes reference to the stylesheet', () => {
      assert.fileContent(componentModule, 'import styles from \'./styles\';');
    });

    it('calls boilerplate hooks', () => {
      expect(runBoilerplateBeforeHookSpy.calledOnce).to.be.ok;
      expect(runBoilerplateBeforeHookSpy.calledWith(boilerplate)).to.be.ok;
      expect(runBoilerplateAfterHookSpy.calledOnce).to.be.ok;
      expect(runBoilerplateAfterHookSpy.calledWith(boilerplate)).to.be.ok;
    });
  });

  describe('platform specific component', () => {
    before(done => {
      helpers.run(componentGeneratorModule)
      .withPrompts({
        componentName,
        boilerplateName: boilerplate,
        platformSpecific: true,
      }).on('end', done);
    });

    it('sets up .ios and .android versions of the component', () => {
      assert.file([
        'index.ios.js',
        'index.android.js',
      ].map(f => `${appDirectory}/src/components/${componentName}/${f}`));
    });

    it('sets up .ios and .android versions of component tests', () => {
      const componentDirectory = `${appDirectory}/src/components/${componentName}`;

      assert.noFile(`${componentDirectory}/index.test.js`);
      assert.file([
        `${componentDirectory}/index.android.test.js`,
        `${componentDirectory}/index.ios.test.js`,
      ]);
    });
  });

  describe('component without tests', () => {
    before(done => {
      helpers.run(componentGeneratorModule).withOptions({
        doNotGenerateTests: true,
      }).withPrompts({
        componentName,
        boilerplateName: boilerplate,
      }).on('end', done);
    });

    it('sets up all component jazz', () => {
      assert.file([
        'index.js',
        'styles.js',
      ].map(f => `${appDirectory}/src/components/${componentName}/${f}`));
    });

    it('does not include tests', () => {
      assert.noFile([
        'index.test.js',
      ].map(f => `${appDirectory}/src/components/${componentName}/${f}`));
    });
  });

  describe('connected component (container)', () => {
    const reducerName = 'todos';

    before(done => {
      helpers.run(componentGeneratorModule).withOptions({
        isContainer: true,
        reducerName,
      }).withPrompts({
        componentName,
        boilerplateName: boilerplate,
      }).on('end', done);
    });

    it('sets up all component jazz', () => {
      assert.file([
        'index.js',
        'styles.js',
        'index.test.js',
      ].map(f => `${appDirectory}/src/components/${componentName}/${f}`));
    });

    it('exposes component wrapped into connect and original component', () => {
      const containerModule = `${appDirectory}/src/components/${componentName}/index.js`;

      assert.fileContent(containerModule,
        `export default connect(\n  createSelector(selectTodos, (${reducerName}) => ({ ${reducerName} })),\n  mapDispatchToProps\n)(${componentName});`
      );

      assert.fileContent(containerModule,
        `export class ${componentName}`
      );
    });

    it('imports selector from the reducer module', () => {
      assert.fileContent(`${appDirectory}/src/components/${componentName}/index.js`,
        `import { selectTodos } from '../../state/${reducerName}/reducer';`
      );
    });
  });
});
