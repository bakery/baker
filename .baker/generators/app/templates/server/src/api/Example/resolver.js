import Parse from 'parse/node';
import Example from './model';

export default {
  Example: {
    text: (root) => root.get('text'),
  },
  Query: {
    examples(root, { }, { Query, user }) {
      const query = new Query(Example);
      return query.find();
    },
  },
  Mutation: {
    addExanple(_, { text }, { Query, user }) {
      const newExample = new Query(Example).create({ isComplete: false, text, user });
      if (user) {
        newExample.setACL(new Parse.ACL(user));
      }
      return newExample.save().then(ex => ex);
    },

    deleteExample(_, { id }, { Query }) {
      return new Query(Example).get(id).then(example => {
        if (example) {
          example.destroy();
        }
        return example;
      });
    },
  },
};
