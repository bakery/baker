module.exports = {
  before(generator) {
    generator.installNPMPackage('react-native-maps@https://github.com/lelandrichardson/react-native-maps.git');
    generator.linkRNPMPackage('react-native-maps');
  },
};
