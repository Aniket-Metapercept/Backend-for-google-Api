const router = require('express').Router()
const passport = require('passport');

var access_token1 = ""

router.get("/google", passport.authenticate("google", { scope: ["profile","email",'https://www.googleapis.com/auth/calendar.events', 
'https://www.googleapis.com/auth/calendar.readonly'] }));

router.get('/login/failed',(req,res)=>{
    console.log("log fail")
    res.send("failed")
})

router.get('/login/success',(req,res)=>{
    console.log("log successful")
    if(req.user){
        access_token1 = req.user.token
        res.json({
            success:true,
            user:req.user
            
        })
    }
})




router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect("http://localhost:4200/")
})



router.get("/google/callback",passport.authenticate("google", {
    //   successRedirect: '/auth/login/success',
      successRedirect: 'http://localhost:4200/home',
      failureRedirect: "/auth/login/failed",
    }),


  );


// Github

router.get('/github',
  passport.authenticate('github', { scope: [ "profile","email"] }));


router.get("/github/callback",passport.authenticate("github", {
    //   successRedirect: '/auth/login/success',
      successRedirect: 'http://localhost:4200/home',
      failureRedirect: "/auth/login/failed",
    }),


  );



//   router.get( '/google/callback',
//   passport.authenticate( 'google', {
//     successRedirect: '/protected',
//     failureRedirect: '/auth/google/failure'
//   })
// );

module.exports = router