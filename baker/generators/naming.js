import changeCase from 'change-case';

const namingConventions = {
  applicationName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => changeCase.pascal(name),
  },

  componentName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => changeCase.pascal(name),
  },

  reducerName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => changeCase.camelCase(name),
  },

  selectorName: {
    clean: reducer => `select${changeCase.pascalCase(reducer)}`,
  },

  sagaName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => changeCase.camelCase(name),
  },

  modelName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => changeCase.pascal(name),
  },
};

export default namingConventions;
