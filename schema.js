import graphql, { 
  GraphQLObjectType, 
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql';
import DB      from './db';

const User = new GraphQLObjectType({
  name: `User`,
  description: `A GHList User`,
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(user) {
          return user.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(user) {
          return user.lastName;
        }
      },
      ghUsername: {
        type: GraphQLString,
        resolve(user) {
          return user.ghUsername;
        }
      },
    }
  }
})

const Lists = new GraphQLObjectType({
  name: `Lists`,
  description: `Lists created by a User`,
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(list) {
          return list.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(list) {
          return list.title;
        }
      },
      items: {
        type: GraphQLInt,
        resolve(list) {
          return list.items;
        }
      },
    }
  }
})

const Query = new GraphQLObjectType({
  name: `Query`,
  description: `A root query`,
  fields: () => {
    return {
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          },
          ghUsername: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return DB.models.users.findAll({where: args})
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

module.exports = Schema;
