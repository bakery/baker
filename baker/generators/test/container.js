/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';

const expect = chai.expect;

describe('generator-rn:container', () => {
  const containerName = 'MyContainer';
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const containerModule = `${appDirectory}/components/${containerName}/index.js`;
  const stylesheetModule = `${appDirectory}/components/${containerName}/styles.js`;

  describe('simple container', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../src/generators/container'))
        .withPrompts({
          containerName,
          boilerplateName: boilerplate,
          addReducer: false
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('sets up all container jazz', () => {
      assert.file([
        'index.js',
        'test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));

      assert.noFile([
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));
    });

    it('exposes component wrapped into connect', () => {
      assert.fileContent(containerModule,
        `export default connect(mapStateToProps, mapDispatchToProps)(${containerName});`);
    });

    it('generates a stylesheet', () => {
      assert.file(stylesheetModule);
    });

    it('includes reference to the stylesheet', () => {
      assert.fileContent(containerModule, `import styles from './styles';`);
    });
  });

  describe('container with a reducer', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../src/generators/container'))
        .withOptions({
          boilerplateName: boilerplate
        })
        .withPrompts({
          containerName,
          addReducer: true
        }).on('ready', function (generator) {
        }).on('end', done);
    });

    it('generates reducer related files', () => {
      assert.file([
        'actions.js',
        'actions.test.js',
        'constants.js',
        'reducer.js',
        'reducer.test.js'
      ].map(f => `${appDirectory}/components/${containerName}/${f}`));
    });

    it('imports selector from the reducer module', () => {
      assert.fileContent(`${appDirectory}/components/${containerName}/index.js`,
        `import { selectMyContainer } from './reducer';`
      );
    });

    it('references imported reducer in the connect set up', () => {
      assert.fileContent(`${appDirectory}/components/${containerName}/index.js`,
        `createSelector(selectMyContainer, (myContainer) => ({ myContainer }))`
      );
    });
  });
});
