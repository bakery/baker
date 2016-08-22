# Testing

Baker includes test setups for the following 
 
- React Native application
- Application server
- CI tests for both RN app and app server 
- Baker

## Testing your React Native application

RN tests use [Mocha](https://github.com/mochajs/mocha), [Enzyme](https://github.com/airbnb/enzyme) and [React Native Mock](https://github.com/lelandrichardson/react-native-mock). 

Baker will test anything within **app/src** directory (and its subdirectories) that looks like ***.test.js**. Generally speaking, you will not need to create any test suites manually since scaffolding feature takes care of creating tests for your components, actions and reducers.

To test your RN application, use the following command

```
npm run test:app
```

## Testing server code

To run tests against your application server code, use the following command

```
npm run test:server
```

Server tests reside in **server/tests** directory

## Testing Baker

To run tests against Baker's internals (generators mostly)

```
npm run test:baker
```

## Baker CI tests

There are a few useful scripts that get run by Travis grouped under **ci** command in package.json. These include:

- test Baker
- test RN app
- test application server
- try starting an app server to confirm that it works
- try building RN app for both iOS and Android to confirm it builds correctly    