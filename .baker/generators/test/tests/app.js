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
    'app/src/state/index.js',
    'app/src/state/action-types.js',
    'app/src/state/reducers.js',
    'app/src/settings.js',
    'app/src/setup.js',
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
      }
    });
  });

  after(() => {
    mockery.disable();
  });

  describe('simple generator', () => {
    before(done => {
      helpers.run(appGeneratorModule)
        .withOptions({
          name: applicationName,
        })
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
      const args = _execSyncSpy.getCall(0).args;

      expect(args[0]).to.be.oneOf(['npm install', 'yarnpkg install']);
      expect(args[1]).to.eql({
        cwd: _generator.destinationPath('app'),
      });
    });

    it('calls child_process.execSync to install server deps', () => {
      const args = _execSyncSpy.getCall(1).args;

      expect(args[0]).to.be.oneOf(['npm install', 'yarnpkg install']);
      expect(args[1]).to.eql({
        cwd: _generator.destinationPath('server'),
      });
    });

    it('calls child_process.execSync to link to app settings', () => {
      expect(_execSyncSpy.getCall(2).args).to.eql([
        'ln -s app/settings ./settings', {
          cwd: _generator.destinationPath('.'),
        },
      ]);
    });

    it('adds settings directory to the app directory', () => {
      assert.file([
        'app/settings/development/base.json',
        'app/settings/development/android.json',
        'app/settings/development/ios.json',
        'app/settings/development/server.json',
        'app/settings/production/base.json',
        'app/settings/production/android.json',
        'app/settings/production/ios.json',
        'app/settings/production/server.json',
      ]);
    });

    it('adds .gitignore with server.json in app/settings/production', () => {
      assert.file([
        'app/settings/production/.gitignore',
      ]);
      assert.fileContent('app/settings/production/.gitignore', 'server.json');
    });

    it('creates a fastlane directory with fastlane config + Gemfile', () => {
      assert.file([
        'app/fastlane/Gemfile',
        'app/fastlane/Fastfile',
        'app/fastlane/Matchfile',
      ]);
    });

    it('sets up icons and launch images for ios', () => {
      expect(_execSyncSpy.getCall(3).args).to.eql([
        'npm run icons', {
          cwd: _generator.destinationPath('.'),
        },
      ]);
      // XX: need to move this to a separate test specific to icon generator
      // assert.file([
      //   'AppIcon.appiconset/Contents.json',
      //   'AppIcon.appiconset/Icon-App-40x40@1x.png',
      //   'AppIcon.appiconset/Icon-App-60x60@2x.png',
      //   'AppIcon.appiconset/Icon-App-76x76@3x.png',
      //   'AppIcon.appiconset/Icon-App-29x29@1x.png',
      //   'AppIcon.appiconset/Icon-App-40x40@2x.png',
      //   'AppIcon.appiconset/Icon-App-60x60@3x.png',
      //   'AppIcon.appiconset/Icon-App-83.5x83.5@2x.png',
      //   'AppIcon.appiconset/Icon-App-29x29@2x.png',
      //   'AppIcon.appiconset/Icon-App-40x40@3x.png',
      //   'AppIcon.appiconset/Icon-App-76x76@1x.png',
      //   'AppIcon.appiconset/Icon-App-29x29@3x.png',
      //   'AppIcon.appiconset/Icon-App-60x60@1x.png',
      //   'AppIcon.appiconset/Icon-App-76x76@2x.png',
      //   'LaunchImage.launchimage/Contents.json',
      //   'LaunchImage.launchimage/Default-Landscape-736h@3x.png',
      //   'LaunchImage.launchimage/Default-Portrait-736h@3x.png',
      //   'LaunchImage.launchimage/Default.png',
      //   'LaunchImage.launchimage/Default@2x-1.png',
      //   'LaunchImage.launchimage/Default-568h@2x-1.png',
      //   'LaunchImage.launchimage/Default-568h@2x.png',
      //   'LaunchImage.launchimage/Default-Landscape.png',
      //   'LaunchImage.launchimage/Default-Portrait.png',
      //   'LaunchImage.launchimage/Default@2x.png',
      //   'LaunchImage.launchimage/Default-667h@2x.png',
      //   'LaunchImage.launchimage/Default-Landscape@2x.png',
      //   'LaunchImage.launchimage/Default-Portrait@2x.png',
      // ].map(p => `app/ios/${applicationName}/Images.xcassets/${p}`));
    });

    it('adds server folder with all the setup', () => {
      assert.file([
        'server/src/index.js',
        'server/package.json',
        'server/Procfile',
        'server/src/graphql/index.js',
        'server/src/graphql/schema.js',
        'server/src/models/Example.js',
        'server/src/parse-server/index.js',
        'server/public/images/logo.png',
        'server/tests/.eslintrc',
        'server/tests/example.test.js',
      ]);
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
        .withOptions({
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
});
