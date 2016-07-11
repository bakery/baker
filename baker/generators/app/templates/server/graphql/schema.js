import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import Example from '../models/example';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      examples: Example.RootQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: Object.assign({}, Example.Mutations),
  }),
});

export default schema;
