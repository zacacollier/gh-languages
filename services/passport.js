// import passport                    from 'passport';
// import { Strategy:GitHubStrategy } from 'passport-github2';
// // 'code' will be set when response is received from GitHub
// passport.use('github', new GitHubStrategy ({
//   clientID: process.env.CLIENT_KEY,
//   clientSecret: process.env.CLIENT_SECRET,
//   callbackURL: 'localhost:4000/users',
// }, (accessToken, refreshToken, profile, done) => {
// console.log(`${accessToken}, ${refreshToken}, ${profile}`)
// // returns 'profile' if successful
//   User.findOne({ where: { ghUserId: profile.id }})
//       .then(user => console.log(user))
//       .catch(err => console.log(`Cannot find user: ${err}`))
//   // return done(null, profile);
//   // Save user record to database
// });
