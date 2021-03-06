// const GOOGLE_CLIENT_ID = '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com'
// const GOOGLE_CLIENT_SECRET = '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'

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

const GOOGLE_CLIENT_ID = '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'


GITHUB_CLIENT_ID = "04d5ce7e13ce1868fdac";
GITHUB_CLIENT_SECRET = "0ece0032f832fc10f795571c16681b22336278fa";


passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(accessToken)
  console.log(refreshToken)
  console.log(profile._json)
  console.log(profile)
  profile.token = accessToken
  
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
