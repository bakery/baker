# Creating a Component Boilerplate

You can easily create a boilerplate for a new component by adding a handlebar template in: 
```
baker/generators/component/templates/boilerplates/
```

You can refer to the name of the component by using:
```handlebars
{{componentName}}
```

In place of your export statement, you should include:
```handlebars 
{{> mapDispatchAndPropsAndConnect }}
```
at the end of the file.

For instance, the Vanilla template looks like:

```handlebars
class {{componentName}} extends Component {
  render() {
    return (
      <View style={ styles.container }>
        <Text>{{componentName}}</Text>
      </View>
    );
  }
}

{{> mapDispatchAndPropsAndConnect }}
```