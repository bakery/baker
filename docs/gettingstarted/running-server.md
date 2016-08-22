# Running server

Baker's application server is based on Express with Parse Server, Parse Dashboard and GraphQL endpoints attached. Server script supports 3 modes: standard, watch and debug. In all 3 modes, you will end up with a server running on port **8000** with a few endpoints exposed:

- http://localhost:8000/dashboard - Parse Server Dashboard
- http://localhost:8000/graphql - GraphQL endpoint   

## Running server in standard mode

```bash
npm run server
```

## Running server in watch mode

In watch mode, the server will automatically restart when you change any javascript file in the server directory - super useful for development

```bash
npm run server:watch
```

## Debugging server

When running in debug mode, you can use [Node Inspector](https://github.com/node-inspector/node-inspector) to debug server side code

```
npm run server:debug
```