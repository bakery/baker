import parseGraphQLHTTP from 'parse-graphql-server';
import schema from './schema';

export default {
  setup(app, graphiql = false) {
    app.use('/graphql', parseGraphQLHTTP({ schema, graphiql }));
  },
};
