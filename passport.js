
// const passport = require('passport')
// const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;



// passport.serializeUser((user,done)=>{
    
//   done(user)
// })

// passport.deserializeUser((user,done)=>{

//   done(user)
// })

// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback", 
//     // callbackURL: "/auth/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//     console.log(profile._json)
//     done(null,profile)

//   }
// ));



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GithubStrategy = require("passport-github2").Strategy;


passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(profile._json)
  return done(null, profile);
}));



passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);




passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
