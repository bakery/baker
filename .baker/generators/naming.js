import changeCase from 'change-case';

const namingConventions = {
  componentName: {
    regEx: /^[A-Z][0-9A-Z]*$/i,
    clean: name => {
      return changeCase.pascal(name);
    }
  },

  reducerName: {
    clean: name => {
      return changeCase.camelCase(name);
    }
  },

  selectorName: {
    clean: componentName => {
      return `select${changeCase.pascalCase(componentName)}`;
    }
  }
};

export default namingConventions;
