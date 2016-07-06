/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mkdirp from 'mkdirp';
import fs from 'fs-extra';

const expect = chai.expect;

describe('generator-rn:reducer', () => {
  const appDirectory = 'app';
  const container = 'Comments';

  describe('without existing reducers module', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../src/generators/reducer'))
      .withOptions({
        container
      }).withPrompts({
        appDirectory,
        container
      })
      .on('ready', function (generator) {
      }).on('end', done);
    });

    it('creates reducer files', () => {
      assert.file([
        'reducer.js',
        'reducer.test.js',
        'actions.js',
        'actions.test.js',
        'constants.js'
      ].map(f => `${appDirectory}/components/${container}/${f}`));
    });

    it('updates root reducers file with new reducer info', () => {
      const reducersModulePath = `${appDirectory}/reducers.js`;
      assert.file(reducersModulePath);
      assert.fileContent(reducersModulePath,
        `import comments from './components/${container}/reducer'`
      );
      assert.fileContent(reducersModulePath,
        `comments: comments`
      );
    });

    it('default exports newly created reducer ', () => {
      const reducerModulePath = `${appDirectory}/components/${container}/reducer.js`;
      assert.fileContent(reducerModulePath,
        `export default comments`
      );
    });

    it('exports a selector for the newly created reducer ', () => {
      const reducerModulePath = `${appDirectory}/components/${container}/reducer.js`;
      assert.fileContent(reducerModulePath,
        `export function selectComments(state) {`
      );
    });
  });
});
