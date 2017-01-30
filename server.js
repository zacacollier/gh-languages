const Express   = require('express');
const GraphHTTP = require('express-graphql');
const Schema    = require('./schema');

const PORT = 3000;

const app = Express();

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
