import fs from 'fs';
import _ from 'lodash';
import { parseJSSource } from '../esprima';

module.exports = {
  getAvailableReducers(reducersModulePath) {
    try {
      const reducersModule = parseJSSource(
        fs.readFileSync(reducersModulePath).toString()
      );

      const applicationReducersVar = _.find(reducersModule.body,
        d => d.type === 'VariableDeclaration' &&
          d.declarations[0].id.name === 'applicationReducers'
      );

      return _.map(applicationReducersVar.declarations[0].init.properties, p => p.key.name);
    } catch (e) {
      return [];
    }
  },
};
