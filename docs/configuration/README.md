# Application configuration

Application configuration files are located inside ```application/settings``` with a symlink in the project root. Settings are shared between server and client.

- **base.json** regroups common settings shared between client and server
- **android.json** extends _base.json_ and overrides settings for android
- **ios.json** extends _base.json_ and overrides settings for ios
- **server.json** extends _base.json_ and overrides settings for the server 

## Development VS Production

Settings directory contains 2 subdirectories _development_ and _production_ for development and production environments respectively.

**Note:** _settings/production/server.json_ is automatically excluded from source control to prevent your production settings from landing in your repository