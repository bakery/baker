module.exports = {
  runBoilerplateHook(boilerplate, hookType) {
    let moduleHook;

    try {
      const hookModuleLocation = this.templatePath(`./boilerplates/${boilerplate}__hook.js`);
      // eslint-disable-next-line global-require
      moduleHook = require(hookModuleLocation);
    } catch (e) {
      // no hooks
    }

    if (!moduleHook) {
      return;
    }

    switch (hookType) {
      case 'before':
        if (moduleHook.before) {
          moduleHook.before(this);
        }
        break;
      case 'after':
        if (moduleHook.after) {
          moduleHook.after(this);
        }
        break;
      default:
        throw new Error('Invalid hook type', hookType);
    }
  },

  runBoilerplateBeforeHook(boilerplate) {
    this.runBoilerplateHook(boilerplate, 'before');
  },

  runBoilerplateAfterHook(boilerplate) {
    this.runBoilerplateHook(boilerplate, 'after');
  },
};
