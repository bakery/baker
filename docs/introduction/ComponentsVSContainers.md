# Components VS Containers

Pure Components (a.k.a. Presentational Components) do not have direct access to the app data - the data comes from their parent component (using props). 

Container Components (a.k.a. Containers) connect to application state using the [connect function](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) from React Redux.

When generating a new Container, the following will be added to Container's ```index.js```:

```javascript
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {}; 
}
export default connect(mapStateToProps, mapDispatchToProps)(MyNewContainer);
```

For more details on the difference, see [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.jfhjwnlv3).

**Note:** We do NOT separate components and containers into different sub-directories. Both components and containers reside within ```/components``` directory. 
This is because the nature of your component might change as you are building your app and having a single directory for containers and pure components will save you from migrating import paths.
