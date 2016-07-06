
# Scaffolding 

Baker uses a [Yeoman](http://yeoman.io/)-based [React Native generator](https://github.com/thebakeryio/generator-rn).

## Usage

```sh
npm run generate
```

## Container Components

You can choose to generate a *Container* which will connect to the application state using the [connect function](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) from React Redux.

![Component generator](.github/component-generator.png)

See [Components VS Containers](ComponentsVSContainers.md) for a more in-depth explanation of differences.

## Generating Components

The component generator has the following options:

- **component name**: defines the name of the component and of the folder it is created in.
- **boilerplate**: setups the boilerplate code for the component (Vanila is a default component boilerplate with a bare minimum of setup).
- **plaform specific code**: generate *.ios* and *.android* versions of your component in case you need platform specific implementation of the component. Default to a single version of the component for both platforms.

## Container Components

Container generator includes all Component options in addition to:

- **reducer + actions + constants**: you can choose to create a boilerplate reducers, actions & constants modules to associate with your container (defaults to true).

![Component generator](.github/container-generator.png)

When generating reducers, your container's reducers will automatically be combined to the rest of your application's reducers in ```app/reducers.js```:

```javascript
import myNewContainer from './components/MyNewContainer/reducer';
import { combineReducers } from 'redux-immutable';

// XX: Do not rename this variable if you want reducer generator
// to keep working properly (and you do want that, right?)
const applicationReducers = {
  myNewContainer: myNewContainer
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
```