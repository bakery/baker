# Scaffolding models

Models are server side components based on **Parse.Object** exposing GraphQL schema.  

## Running model generator

```
npm run generate
? Choose the generator to use (Use arrow keys)
  Component
  Container
  Navigation
  Saga
❯ Model
```

Baker will ask you to provide a name for the new model

```
? What should your model be called?
```

## Models directory overview

Models are added to **server/src/models** directory:

```
├── models
    ├── Example.js
    └── Todo.js
```

## GraphQL schema

Newly created schemas are also registered in **server/src/graphql/schema.js**. You can try quering newly created model using Graphiql interface:

```
npm run server
```

Head to http://localhost:8000/graphql and try runnign the following query (assuming your model is called _Todo_):

```
{ 
  todo { 
    id, text 
  }
}
```

Generator also adds 2 sample mutations that you can try out as well

```
mutation { 
  addTodo(text: "Another todo") { 
    id, text 
  }
}
```

And you can get rid of a newly created item

```
mutation { 
  deleteTodo(id: "id-of-your-item") { 
    id, text 
  }
}
```
