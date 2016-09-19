import { ParseServer } from 'parse-server';
import Parse from 'parse/node';
import ParseDashboard from 'parse-dashboard';

export default {
  setup(app, appName, settings) {
    Parse.initialize(settings.parseServerApplicationId, 'js-key', settings.parseServerMasterKey);
    Parse.serverURL = settings.parseServerURL;

    const api = new ParseServer({
      appId: settings.parseServerApplicationId,
      masterKey: settings.parseServerMasterKey,
      serverURL: settings.parseServerURL,
      databaseURI: settings.parseServerDatabaseURI,
    });

    const iconsFolder = process.env.NODE_ENV === 'development' ?
      './server/public/images' : './public/images';

    app.use('/parse', api);

    app.use(
      '/dashboard',
      // eslint-disable-next-line new-cap
      ParseDashboard({
        apps: [{
          serverURL: settings.parseServerURL,
          appId: settings.parseServerApplicationId,
          masterKey: settings.parseServerMasterKey,
          appName,
          iconName: 'logo.png',
        }],
        iconsFolder,
        users: settings.parseServerDashboardUsers,
      }, true /* XX: use allowInsecureHTTPInParseDashboard, gotta use true for Heroku SSL */)
    );
  },
};
