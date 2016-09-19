import { Platform } from 'react-native';
import base from '../settings/development';
import iosOverrides from '../settings/development.ios';
import androidOverrides from '../settings/development.android';

export default {
  load() {
    return Object.assign({}, base, Platform.select({
      ios: iosOverrides,
      android: androidOverrides,
    }));
  },
};
