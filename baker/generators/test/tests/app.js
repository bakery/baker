import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fsExtra from 'fs-extra';
import fs from 'fs';
import _ from 'lodash';

const expect = chai.expect;
const appGeneratorModule = path.join(__dirname, '../../app');

describe('generator-rn:app', () => {
  let _generator;
  let _checkIfRNIsInstalledStub = null;
  let _initRNSpy = null;
  let _abortSetupStub = null;
  const applicationName = 'MyReactApp';
  const applicationFiles = [
    'app/reducers.js',
    'app/setup.js',
    'app/store.js',
    'app/components/App/index.js',
    'app/components/App/styles.js',
    'index.ios.js',
    'index.android.js',
    'package.json',
  ];

  const _stubThings = generator => {
    _generator = generator;
    _checkIfRNIsInstalledStub = sinon.stub(generator, '_checkIfRNIsInstalled').returns(true);
    _initRNSpy = sinon.stub(generator, '_initRN').returns(true);
    _abortSetupStub = sinon.stub(generator, '_abortSetup').returns(true);
  };

  const _unstubThings = () => {
    _checkIfRNIsInstalledStub && _checkIfRNIsInstalledStub.restore();
    _initRNSpy && _initRNSpy.restore();
    _abortSetupStub && _abortSetupStub.restore();
  };

  describe('simple generator', () => {
    before(done => {
      helpers.run(appGeneratorModule)
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('checks if react-native is installed', () => {
      expect(_checkIfRNIsInstalledStub.calledOnce).to.be.ok;
    });

    it('runs RN setup script', () => {
      expect(_initRNSpy.calledOnce).to.be.ok;
    });

    it('sets up all the app files', () => {
      assert.file(applicationFiles);
    });
  });

  describe('running generator in a non-empty directory', () => {
    before(done => {
      helpers.run(appGeneratorModule)
        .inTmpDir(dir => {
          fsExtra.copySync(
            path.join(__dirname, './fixtures/random-file.txt'),
            path.join(dir, 'random-file.txt')
          );
        })
        .withPrompts({
          name: applicationName,
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('sets things up in a newly created directory', () => {
      expect(_generator.destinationPath('.').indexOf(applicationName) !== -1).to.be.ok;
      assert.file(applicationFiles);
    });
  });

  describe('running generator in a non-empty directory with something that looks like a RN app', () => {
    before(done => {
      helpers.run(appGeneratorModule)
        .inTmpDir(dir => {
          // XX: make it look like a directory with some RN artifacts
          fs.mkdirSync(path.join(dir, 'android'));
          fs.mkdirSync(path.join(dir, 'ios'));
          fs.writeFileSync(path.join(dir, 'index.ios.js'), '00000000');
          fs.writeFileSync(path.join(dir, 'index.android.js'), '00000000');
        })
        .withPrompts({
          name: applicationName,
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('bails on app generation', () => {
      expect(_abortSetupStub.calledOnce).to.be.ok;
    });
  });

  describe('running generator in a non-empty directory with --baker flag', () => {
    let originalPackageJSON;

    before(done => {
      helpers.run(appGeneratorModule)
        .inTmpDir(dir => {
          fsExtra.copySync(
            path.join(__dirname, './fixtures/random-file.txt'),
            path.join(dir, 'random-file.txt')
          );
          fsExtra.copySync(
            path.join(__dirname, './fixtures/package.json'),
            path.join(dir, 'package.json')
          );
          originalPackageJSON = fsExtra.readJsonSync(path.join(__dirname, './fixtures/package.json'));
        })
        .withOptions({ baker: 'baker' })
        .withPrompts({
          name: applicationName,
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('does not create a new directory', () => {
      expect(_generator.destinationPath('.').indexOf(applicationName) === -1).to.be.ok;
    });

    it('sets up all the application files', () => {
      assert.file(applicationFiles);
    });

    it('updates existing package.json with relevant data but also keeps original jazz in deps and scripts', () => {
      const packageJSON = fsExtra.readJsonSync(_generator.destinationPath('package.json'));

      expect(packageJSON.devDependencies).to.contain.all.keys(originalPackageJSON.devDependencies);
      expect(packageJSON.scripts).to.contain.all.keys(originalPackageJSON.scripts);

      expect(packageJSON.dependencies).to.contain.all.keys([
        'react-redux',
        'redux',
        'redux-immutable',
        'reselect',
      ]);

      // expect(packageJSON.devDependencies).to.contain.all.keys([
      //   'babel-eslint',
      //   'babel-polyfill',
      //   'eslint',
      //   'eslint-loader',
      //   'eslint-plugin-react',
      //   'remote-redux-devtools',
      // ]);

      expect(packageJSON.name).to.equal(applicationName);
    });
  });
});
