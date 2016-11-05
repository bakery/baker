/* eslint no-console:off */

const path = require('path');
const appName = require('../app/package.json').name;
const makeIcons = require('../node_modules/mobile-icon-resizer');
const config = require('../app/assets/config.json');

const defaultOptions = {
  originalIconFilename: './app/assets/icon.png',
  originalLogoFilename: './app/assets/icon.png',
  iosOutputFolder:
    path.join('./app/ios/', appName, '/Images.xcassets/AppIcon.appiconset'),
  iosLaunchImageFolder:
    path.join('./app/ios/', appName, '/Images.xcassets/LaunchImage.launchimage'),
  androidOutputFolder: './app/android/app/src/main/res',
};

const options = Object.assign(defaultOptions, config);

makeIcons(options, (err) => {
  if (err) {
    console.log(err);
    console.log('Cannot generate icons for Android and iOS');
    console.log('Make sure you have ImageMagick installed: https://www.imagemagick.org/script/binary-releases.php');
    console.log('You can then try generating icons using: npm run icons');
  } else {
    console.log('App icons successfully generated');
  }
});

