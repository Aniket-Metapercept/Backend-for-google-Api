const router = require('express').Router()
const passport = require('passport');
const { addEventToGoogleCalender, getAllEvents } = require('../sendEvents');

router.get("/google", passport.authenticate("google", { scope: ["profile","email",'https://www.googleapis.com/auth/calendar.events', 
'https://www.googleapis.com/auth/calendar.readonly'] }));

router.get('/login/failed',(req,res)=>{
    console.log("log fail")
    res.send("failed")
})

router.get('/login/success',(req,res)=>{
    console.log("log successful")
    if(req.user){
        res.json({
            success:true,
            user:req.user
            
        })
    }
})


router.post('/addevents',async (req,res) =>{
  console.log(req.body)
  
  let  ans = 0
  ans = addEventToGoogleCalender(req.body)
  
  // console.log(ans)
  // res.redirect('https://calendar.google.com/calendar/u/0/r')
 
  // setTimeout((ans) => {
    

  // }, 3000);
 
  // function showResponse(ans) {
  //   console.log(ans, "ans")
  //   if(ans){
      res.json(true)
  //   } else {
      // res.json(false)
  //   }
  // }
  
  // setTimeout(showResponse, 4000, ans);


})

router.post('/addevents2',async (req,res) =>{
  console.log(req.body)
  
  var { summary, description, to, from, location, token }  = req.body

    // var to = Date(to)
    // var from = Date(from)


    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
    // refresh_token: '1//04deCcZm249pKCgYIARAAGAQSNwF-L9IrIPLC5701gQNTJnYCiP9IEsCknDwfCern77Bn6NlP65CER2_GGiLXBSJMxWr3Z_NwhIQ',
    access_token:token
    // access_token:'ya29.A0ARrdaM-JNPquZ9i5gCCO1g6SvAkdVq_ibQJx2Kq7x5n6q0lFMFxnElmR42tDtIl-ppCWw_zJD5y230v8fZOxPOCmWELoKaWVAI7Qo1M6W28ChepX7_9hdZtsf5o8DT0KA5EoTuAwNqdKSK1QLbB__cktwSPS'
    })

    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    // Create a new event start date instance for temp uses in our calendar.
    const eventStartTime = new Date()
    console.log(from.split('T')[0].split('-')[2])
    eventStartTime.setDate(from.split('T')[0].split('-')[2])
    eventStartTime.setHours(from.split('T')[1].split('-')[0].split(':')[0])
    eventStartTime.setMinutes(from.split('T')[1].split('-')[0].split(':')[1])

    // eventStartTime.setTime(from.split('T')[1])

    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date()
    console.log(eventEndTime.getDate())
    eventEndTime.setDate(to.split('T')[0].split('-')[2])
    eventEndTime.setHours(to.split('T')[1].split('-')[0].split(':')[0])
    eventEndTime.setMinutes(to.split('T')[1].split('-')[0].split(':')[1])

    console.log(eventEndTime)
    // Create a dummy event for temp uses in our calendar
    const event = {
    summary: String(summary),
    location: String(location),
    description: String(description),
    colorId: 1,
    start: {
        dateTime: eventStartTime,
        timeZone: 'IST',
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'IST',
    },
    }

    // console.log('data =>',data.summary )
    // Check if we a busy and have an event on our calendar for the same time.
    calendar.freebusy.query(
    {
        resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'America/Denver',
        items: [{ id: 'primary' }],
        },
    },
    (err, response) => {
        // Check for errors in our query and log them if they exist.
        if (err) {
            console.error('Free Busy Query Error: ', err)
            res.json("Error")
            return 
            }
        // Create an array of all events on our calendar during that time.
        const eventArr = response.data.calendars.primary.busy
        console.log(eventArr)
        // Check if event array is empty which means we are not busy
        if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
            { calendarId: 'primary', resource: event },
            err => {
            // Check for errors and log them if they exist.

            // if (err) return console.error('Error Creating Calender Event:', err)
            
            if (err) {
              res.json("Error") 
              return 
            }
            // Else log that the event was created.
            // return console.log('Calendar event successfully created.')
            res.json("Data Added Successfully") 
            return
            }
        )

        // If event array is not empty log that we are busy.
        res.json(`Sorry I'm busy...`)
        return 
    }
    )


})





const { google } = require('googleapis')
// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(
    '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com','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'
)


router.get('/getsEvents/:token',async(req,res)=>{
  // ans = await getAllEvents()
  // console.log(ans)
  // res.send(ans)

  oAuth2Client.setCredentials({

    access_token: req.params.token
  }) 

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })



  function listUpcomingEvents() {
      calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
      // 'timeMax': '2022-03-17T06:22:50.205Z',
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 200,
        'orderBy': 'startTime'
      }).then(function(response) {
          // console.log(response.data.items)
          
        var events = response.data.items; 
        console.log(response.data)
        console.log(events)
        console.log('Upcoming events:');
        let data = []
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            console.log(event.summary + ' (' + when + ')')
            data[i] = (event.summary + ' (' + when + ')')
           
        }
        res.json(data)
        } else {
          console.log('No upcoming events found.');
          res.json('No upcoming events found.')
        }
      });
    } 

  listUpcomingEvents()

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