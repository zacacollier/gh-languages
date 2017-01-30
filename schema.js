import graphql, {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
}              from 'graphql';
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
      lists: {
        type: new GraphQLList(Lists),
        resolve(user) {
          return user.getLists();
        }
      }
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
      user: {
        type: User,
        resolve(list) {
          return list.getUser();
        }
      },
    }
  }
})

const Query = new GraphQLObjectType({
  name: `Query`,
  description: `A root query`,  // root being 'Users'
  fields: () => {
    return {
      users: {
        type: new GraphQLList(User),
        args: {                // restrict returnable data with args
          id: {
            type: GraphQLInt
          },
          ghUsername: {
            type: GraphQLString
          },
          lists: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return DB.models.user.findAll({where: args}) // remember that the model queried must match the name defined in db.js!!!
        }
      },
      lists: {
        type: new GraphQLList(Lists),
        resolve(root, args) {
          return DB.models.list.findAll({where: args})
        }
      },
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
