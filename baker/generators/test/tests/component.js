/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import yeoman from 'yeoman-generator';

const expect = chai.expect;
const componentGeneratorModule = path.join(__dirname, '../../component');

describe('generator-rn:component', () => {
  const componentName = 'MyComponent';
  const boilerplate = 'Vanila';
  const appDirectory = 'app';
  const componentModule = `${appDirectory}/components/${componentName}/index.js`;
  const stylesheetModule = `${appDirectory}/components/${componentName}/styles.js`;

  describe('simple component', () => {
    before(done => {
      helpers.run(componentGeneratorModule)
      .withPrompts({
        componentName,
        boilerplateName: boilerplate,
      }).on('end', done);
    });

    it('sets up all component jazz', () => {
      assert.file([
        'index.js',
        'test.js',
        'styles.js',
      ].map(f => `${appDirectory}/components/${componentName}/${f}`));
    });

    it('exports component as-is without container wrapping', () => {
      assert.fileContent(componentModule, `export default ${componentName}`);
    });

    it('generates a stylesheet', () => {
      assert.file(stylesheetModule);
    });

    it('includes reference to the stylesheet', () => {
      assert.fileContent(componentModule, 'import styles from \'./styles\';');
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
      ].map(f => `${appDirectory}/components/${componentName}/${f}`));
    });
  });
});
