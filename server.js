require('dotenv').config();

import bodyParser                  from 'body-parser';
import Express                     from 'express';
import GraphHTTP                   from 'express-graphql';
import methodOverride              from 'method-override';
import passport                    from 'passport';
import session                     from 'express-session';
const  FileStore                   =    require('session-file-store')(session);
import Schema                      from './schema/schema.js';
import { Strategy } from 'passport-github2';
import                                  './services/passport.js';

const app         =     Express();
const PORT        =     4000;

//TODO: Save user to database with findOrCreate
passport.use('github', new Strategy ({
  clientID: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/user',
}, (accessToken, refreshToken, profile, done) => {
  console.log(`${accessToken}, ${refreshToken}, ${profile}`)
  User.findOne({ where: { ghUserId: profile.id }})
      .then(user => console.log(user))
      .catch(err => console.log(`Cannot find user: ${err}`))
}));

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  store: new (require('connect-pg-simple')(session)),
  secret: 'keyboard cat',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 1000 } // 30 days
}));
// app.use(session({
//   cookieName: 'server-session-cookie-id',
//   secret: 'keyboard cat',
//   saveUninitialized: true,
//   resave: true,
//   store: new FileStore()
// }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
)
// Login page should route from /login to /login/auth
app.get('/login',
  passport.authenticate('github', { scope: [ 'user:email' ]}),
  (req, res) => res.redirect('/user')
)

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}))
// function isAuthenticated(req, res, next) {
//   return req.isAuthenticated() ? next() : res.redirect('/login')
// }

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
