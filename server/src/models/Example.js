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
  description: 'A concise description of what Example is',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    // XX: you should probably replace this with something
    // relevant to your model
    text: {
      type: GraphQLString,
      resolve: example => example.get('text'),
    },
    // more field defs here
  }),
});

Example.SchemaType = ExampleType;

Example.RootQuery = {
  type: new GraphQLList(Example.SchemaType),
  resolve: (_, args, { Query }) => {
    const query = new Query(Example);
    return query.find();
  },
};

Example.Mutations = {
  addExample: {
    type: Example.SchemaType,
    description: 'Create a new instance of Example',
    args: {
      text: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: (_, { text }, { Query, user }) => {
      const example = new Query(Example).create({ text });
      if (user) {
        example.setACL(new Parse.ACL(user));
      }
      return example.save().then(td => td);
    },
  },
  deleteExample: {
    type: Example.SchemaType,
    description: 'Delete an instance of Example',
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
