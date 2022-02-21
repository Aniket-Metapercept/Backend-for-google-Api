
  const { google } = require('googleapis')
  // Require oAuth2 from our google instance.
  const { OAuth2 } = google.auth
  const oAuth2Client = new OAuth2(
      '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com','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'
  )
  
var access_token1= ""



const router = require('express').Router()



router.post('/addevents',async (req,res) =>{
  
    var { summary, description, to, from, location, token }  = req.body
  
      // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
      oAuth2Client.setCredentials({
       access_token:token
       })

       access_token1 = token
  
      // Create a new calender instance.
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
      
      // Create a new event start date instance for temp uses in our calendar.
      console.log(from)
      console.log(new Date(from).toISOString(),"segjwipehg")
      
  
      const eventStartTime = new Date(from).toISOString()
      console.log(eventStartTime)
   
      // Create a new event end date instance for temp uses in our calendar.
      const eventEndTime = new Date(to).toISOString()
   
  
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
  
      calendar.freebusy.query(
        {
            resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'America/Denver',
            items: [{ id: 'primary' }],
            },
        }).then((response) => {
          const eventArr = response.data.calendars.primary.busy
  
          console.log(eventArr)
          console.log(response.data)
          // Check if event array is empty which means we are not busy
          if (eventArr.length === 0) {
            calendar.events.insert(
                { calendarId: 'primary', resource: event }
              ).then((r)=>{
  
                // console.log(r)
                res.json(r)
                return 
              }).catch((e)=>{
                res.json(e) 
                return 
              })
          } else {
            res.json(response) // calendars: { primary: { busy: [Array] } }
          }
          
        }).catch((err) => {
              console.error('Free Busy Query Error: ', err)
              res.json(err)
              return 
        });
   
  
  })
  
  
  
  
  
  
  router.get('/getsEvents/:token',async(req,res)=>{
    // ans = await getAllEvents()
    // console.log(ans)
    // res.send(ans)
    console.log(req.user)
  
    oAuth2Client.setCredentials({
  
      access_token: req.params.token
    }) 
  
    access_token1 = req.params.token // it will save token for later use
  
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
          // console.log(response.data)
          // console.log(events)
          console.log('Upcoming events:');
          let data = [{}]
          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              // console.log(event)
              data[i] = event
             
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
  
  
  router.get('/geteventbyid/:id',(req,res)=>{
    // console.log(access_token1)
    oAuth2Client.setCredentials({
      access_token: access_token1
  }) 
  
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  
    calendar.events.get({calendarId:'primary',eventId:req.params.id})
      .then(function(response) {
        console.log(response.data)
        res.json(response.data) 
      }).catch(e=>{
        res.json(e)
      })
  
  })
   
  // Update
  
  router.put('/update/:id',(req,res)=>{
    
    // console.log(req.body)
    oAuth2Client.setCredentials({
      access_token: access_token1
  }) 
  // console.log(req.body.start.dateTime)
    req.body.start.dateTime = new Date(req.body.start.dateTime).toISOString()
    req.body.end.dateTime = new Date(req.body.end.dateTime).toISOString()
    // console.log(req.body.start.dateTime)
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  
    calendar.events.update({calendarId:'primary',eventId:req.params.id,requestBody:req.body})
      .then(function(response) {
        console.log(response.data)
        res.json(response) 
      }).catch(e=>{
        res.send("err "+e)
      })
  
  })
   
  
  //Delete
  
  
  router.delete('/delete/:id',(req,res)=>{
    // console.log(access_token1)
    oAuth2Client.setCredentials({
      access_token: access_token1
  }) 
  
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  
    calendar.events.delete({calendarId:'primary',eventId:req.params.id})
      .then(function(response) {
        console.log(response.data)
        res.json(response) 
      }).catch(e=>{
        res.json(e)
      })
  
  })
  
  module.exports = router