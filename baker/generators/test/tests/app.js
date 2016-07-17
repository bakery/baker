import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fsExtra from 'fs-extra';
import fs from 'fs';
import _ from 'lodash';
import mockery from 'mockery';

const expect = chai.expect;
const appGeneratorModule = path.join(__dirname, '../../app');

describe('generator-rn:app', () => {
  let _generator;
  let _checkIfRNIsInstalledStub = null;
  let _initRNSpy = null;
  let _abortSetupStub = null;
  let _execSyncSpy = null;

  const applicationName = 'MyReactApp';
  const applicationFiles = [
    'app/src/reducers.js',
    'app/src/settings.js',
    'app/src/setup.js',
    'app/src/store.js',
    'app/src/tests.js',
    'app/src/components/App/index.js',
    'app/src/components/App/styles.js',
    'app/src/sagas/index.js',
    'app/index.ios.js',
    'app/index.android.js',
    'app/package.json',
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

  before(() => {
    mockery.enable({
      // warnOnReplace: false,
      warnOnUnregistered: false,
    });

    _execSyncSpy = sinon.spy();

    mockery.registerMock('child_process', {
      execSync(...args) {
        _execSyncSpy.apply(this, args);
      },
    });
  });

  after(() => {
    mockery.disable();
  });

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

    it('calls child_process.execSync to install app deps', () => {
      expect(_execSyncSpy).to.have.been.calledOnce;
      expect(_execSyncSpy).to.have.been.calledWith('npm install', {
        cwd: _generator.destinationPath('app'),
      });
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

  describe('app with server setup', () => {
    before(done => {
      helpers.run(appGeneratorModule)
        .withPrompts({
          name: applicationName,
          addServer: true,
        })
        .on('ready', _stubThings)
        .on('end', done);
    });

    after(_unstubThings);

    it('adds server folder with all the setup', () => {
      assert.file([
        'server/index.js',
        'server/package.json',
        'server/Procfile',
        'server/graphql/index.js',
        'server/graphql/schema.js',
        'server/models/Example.js',
        'server/parse-server/index.js',
        'server/public/images/logo.png',
      ]);
    });

    it('adds settings folder to the project with dev settings', () => {
      assert.file([
        'settings/development.json',
        'settings/development.ios.json',
        'settings/development.android.json',
      ]);
    });
  });
});
