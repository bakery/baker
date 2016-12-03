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

  it('creates model, resolver and schema modules for the model', () => {
    assert.file([
      `${serverDirectory}/src/api/${modelName}/model.js`,
      `${serverDirectory}/src/api/${modelName}/resolver.js`,
      `${serverDirectory}/src/api/${modelName}/schema.js`
    ]);
  });

  it('imports newly created model schema and resolvers in server/src/api/schema module', () => {
    const module = `${serverDirectory}/src/api/schema.js`;
    assert.fileContent(module,
      `import ${modelName}Schema from './${modelName}/schema';`
    );
    assert.fileContent(module,
      `import ${modelName}Resolvers from './${modelName}/resolver';`
    );
  });

  it('references new model\'s schema in server/src/api/schema module', () => {
    assert.fileContent(`${serverDirectory}/src/api/schema.js`, `${modelName}Schema`);
  });

  it('references new model\'s resolvers in server/src/api/schema module', () => {
    assert.fileContent(`${serverDirectory}/src/api/schema.js`,
      `${modelName}Resolvers`
    );
  });
});
