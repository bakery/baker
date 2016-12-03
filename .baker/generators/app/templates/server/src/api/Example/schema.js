export default `
type Example {
  id: ID! 
  text: String!
}
# the schema allows the following query:
type Query {
  examples: [Example]
}
# this schema allows the following mutation:
type Mutation {
  addExample (
    text: String!
  ): Example
  deleteExample (
    id: ID!
  ): Example
}
# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  mutation: Mutation
}
`;
