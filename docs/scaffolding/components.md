# Scaffolding components

Pure Components \(a.k.a. Presentational Components\) do not have direct access to the app data - the data comes from their parent component \(using props\). Refer to Dan Abramov's [article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.jfhjwnlv3) for more details.

**Note:** We do NOT separate components and containers into different sub-directories. Both components and containers reside within \/components directory. This is because the nature of your component might change as you are building your app and having a single directory for containers and pure components will save you from migrating import paths.

## Running component generator

```
npm run generate
? Choose the generator to use (Use arrow keys)
❯ Component
  Container
  Navigation
  Saga
  Model
```

Baker will ask you a few questions to customize your new component

```
? What should your component be called?  <-- type a name for your component           
? Which boilerplate do you want to use? <-- select one of the available boilerplate (defaults to Vanila) [1]  
? Do you need separate versions of this component for iOS and Android? <-- platform specific code [2]
```

\[1\] Component boilerplates include extra code that can be used to pre-populate your components. Refer to [Component Boilerplates](/scaffolding/component-boilerplates.md) section for more information

\[2\] If you want to customize how you component works on different platforms, you can have Baker generate separate .ios and .android versions of the component

## Component directory overview

After successfully running component generator you should see your new component added to app/src/components

```
TextBox
 ├── index.js         <-- main component module containing React component definition
 ├── index.test.js    <-- component test suite
 └── styles.js        <-- stylesheet for your component
```  

At this point you can jump straight into **index.js** module and start customizing your component to make it useful. You can then plug your new component into the main application screen (**app/src/components/App/index.js**) to test it out:

```javascript
import ReactNative from 'react-native';
import React, { Component } from 'react';
import styles from './styles';
import TextBox from '../TextBox';

const { View } = ReactNative;

class App extends Component { 
  render() { 
    return (
      <View style={styles.container}>
        <TextBox />
      </View>
    ); 
  }
}

export default App;
``` 