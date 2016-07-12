import Parse from 'parse/node';
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';


const Example = Parse.Object.extend('Example');

const ExampleType = new GraphQLObjectType({
  name: 'Example',
  description: 'Just an example',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    text: {
      type: GraphQLString,
      resolve: example => example.get('text'),
    },
  }),
});

Example.SchemaType = ExampleType;

Example.RootQuery = {
  type: new GraphQLList(Example.SchemaType),
  args: {
    text: { type: GraphQLString },
  },
  resolve: (_, args, { Query }) => {
    const text = args.text;
    const query = new Query(Example);
    if (typeof text !== 'undefined') {
      query.equalTo('text', text);
    }
    return query.find();
  },
};

Example.Mutations = {
  addExample: {
    type: Example.SchemaType,
    description: 'Create a new example',
    args: {
      text: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { text }, { Query, user }) => {
      const newExample = new Query(Example).create({ text });
      if (user) {
        newExample.setACL(new Parse.ACL(user));
      }
      return newExample.save().then(td => td);
    },
  },
  deleteExample: {
    type: Example.SchemaType,
    description: 'Delete an example',
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, { id }, { Query }) =>
      new Query(Example).get(id).then((example) => {
        if (example) {
          return example.destroy();
        }
        return example;
      }),
  },
};

export default Example;
