module.exports = {
  before(generator) {
    generator.installNPMPackage('react-native-camera@https://github.com/lwansbrough/react-native-camera.git');
    generator.linkRNPMPackage('react-native-camera');
  },
};
