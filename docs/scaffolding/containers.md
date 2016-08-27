---
title: Scaffolding containers
permalink: /scaffolding/containers.html
---
# Scaffolding Containers

Container Components \(a.k.a. Containers\) connect to application state using the [connect function](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) from React Redux. Refer to Dan Abramov's [article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.jfhjwnlv3) for more details.

**Note:** We do NOT separate components and containers into different sub-directories. Both components and containers reside within \/components directory. This is because the nature of your component might change as you are building your app and having a single directory for containers and pure components will save you from migrating import paths.

## Running container generator

Container generator is based on [Component generator](/scaffolding/components.md) which you already might be familiar with

```
npm run generate
? Choose the generator to use
  Component
❯ Container
  Navigation
  Saga
  Model
```

Baker will ask you a few questions to customize your new container

```
? What should your container be called? <-- type a name for your component
? Do you want a reducer + actions + constants generated? <-- create a new reducer for this container?
? Which boilerplate do you want to use? [1]
? Do you need separate versions of this component for iOS and Android? [2]
```

\[1\] Component boilerplates include extra code that can be used to pre-populate your components. Refer to [Component Boilerplates](/scaffolding/component-boilerplates.md) section for more information

\[2\] If you want to customize how you component works on different platforms, you can have Baker generate separate .ios and .android versions of the component

## Conainer directory overview

After successfully running container generator you should see your new container added to app/src/components. While containers share quite a lot of things in common with components, they also come with a few extra pieces:

```
Example
 ├── actions.js         <-- Redux actions 
 ├── actions.test.js    <-- test suite for actions module
 ├── constants.js       <-- constants you can use in actions and reducers
 ├── index.js           <-- main module for the React component this container is based on
 ├── index.test.js      <-- test suites for the component
 ├── reducer.js         <-- reducer
 ├── reducer.test.js    <-- reducer test suite
 └── styles.js          <-- container stylesheet
```

At this point you can jump straight into **index.js** module and start customizing your container to make it useful. You can then plug your new container into the main application screen (**app/src/components/App/index.js**) to test it out:

```javascript
import ReactNative from 'react-native';
import React, { Component } from 'react';
import styles from './styles';
import Example from '../Example';

const { View } = ReactNative;

class App extends Component {
 render() {
   return (
     <View style={styles.container}>
       <Example />
     </View>
   );
 }
}

export default App;
```