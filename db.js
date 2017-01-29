const Sequelize = require('sequelize')

const Conn = new Sequelize(
  'gh',
  'postgres',
  'postgres',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

const { STRING, INTEGER } = Sequelize;

const User = Conn.define('user', {
  firstName: {
    type: STRING,
    allowNull: false
  },
  lastName: {
    type: STRING,
    allowNull: false
  },
  ghUsername: {
    type: STRING,
    allowNull: false
  },
})

const List = Conn.define('list', {
  title: {
    type: STRING,
    allowNull: false
  },
  content: {
    type: STRING,
    allowNull: false
  }
})

const Items = Conn.define('items', {
  ghUsername: {
    type: STRING,
    allowNull: false
  },
  avatar: {
    type: STRING,
    allowNull: false
  },
  ghUserFirstName: {
    type: STRING,
    allowNull: false
  },
  ghUserLastName: {
    type: STRING,
    allowNull: false
  },
  ghUserId: {
    type: INTEGER,
    allowNull: false
  },
})

// Relationships
User.hasMany(List);
List.belongsTo(User);
List.hasMany(Items);
Items.belongsTo(List);

Conn.sync({force: true}).then(() => {
  return User.create({
    firstName: 'George',
    lastName: 'Costanza',
    ghUsername: 'vandelay'
  }).then((user) => {
    console.log(user.get({ plain: true }))
  })
})
