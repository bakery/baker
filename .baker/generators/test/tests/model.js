/* eslint no-unused-vars: 0, no-unused-expressions:0 */

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs-extra';

const expect = chai.expect;

describe('generator-rn:model', () => {
  const appDirectory = 'app';
  const serverDirectory = 'server';
  const modelName = 'Todo';

  before(done => {
    helpers.run(path.join(__dirname, '../../model'))
    .withPrompts({
      modelName,
    })
    .on('end', done);
  });

  it('creates a model file in server/src/models directory', () => {
    assert.file([
      `${serverDirectory}/src/models/Todo.js`,
    ]);
  });

  it('imports newly created model in server/src/graphql/schema module', () => {
    assert.fileContent(`${serverDirectory}/src/graphql/schema.js`,
      `import ${modelName} from '../models/${modelName}';`
    );
  });

  it('references new model\'s root query in server/src/graphql/schema module', () => {
    assert.fileContent(`${serverDirectory}/src/graphql/schema.js`, 'todo: Todo.RootQuery');
  });

  it('references new model\'s mutations in server/src/graphql/schema module', () => {
    assert.fileContent(`${serverDirectory}/src/graphql/schema.js`,
      `${modelName}.Mutations`
    );
  });
});
