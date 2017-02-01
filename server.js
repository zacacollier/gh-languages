require('dotenv').config();

import bodyParser                  from 'body-parser';
import Express                     from 'express';
import GraphHTTP                   from 'express-graphql';
import methodOverride              from 'method-override';
import passport                    from 'passport';
import Schema                      from './schema/schema.js';
import { Strategy } from 'passport-github2';
import                                  './services/passport.js';

const app         =     Express();
const PORT        =     4000;

// 'code' will be set when response is received from GitHub
passport.use('github', new Strategy ({
  clientID: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'localhost:4000/login/success',
}, (accessToken, refreshToken, profile, done) => {
  console.log(`${accessToken}, ${refreshToken}, ${profile}`)
  User.findOne({ where: { ghUserId: profile.id }})
      .then(user => console.log(user))
      .catch(err => console.log(`Cannot find user: ${err}`))
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}))

app.get('/',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
)
// Login page should route from /login to /login/auth
app.get('/login',
  passport.authenticate('github', { scope: [ 'user:email' ]}),
  (req, res) => res.redirect('/user')
)

function isAuthenticated(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/login')
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
