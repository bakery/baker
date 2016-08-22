# Deploying your app

Baker supports 2 types of deployments: mobile app deployment through Fastlane and application server deployment using Heroku 

## Deploying application server to Heroku

```
heroku create name-of-your-app
npm run deploy:server
```

## Deploying mobile application with Fastlane 

**app/fastlane** directory contains configuration for [Fastlane](https://github.com/fastlane/fastlane). 

Please refer to [CI section](/ci/README.md) for more information on how to set up continuous integration for your mobile application