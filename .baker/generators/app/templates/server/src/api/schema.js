import { mergeStrings } from 'gql-merge';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

const schemas = [
];

const resolvers = [
];

const rootDeclarations = `
schema {
  query: Query
  mutation: Mutation
}
`;

const rootSchema = mergeStrings([
  ...schemas,
  rootDeclarations
]);

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: merge.apply(this, resolvers)
});

export default schema;
