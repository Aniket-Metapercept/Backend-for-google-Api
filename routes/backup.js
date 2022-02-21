
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
      // f = Date(from)
  
      // console.log(f.toISOString() , "from")
      
      // Create a new event start date instance for temp uses in our calendar.
      console.log(from)
      console.log(new Date(from).toISOString(),"segjwipehg")
      // console.log(String(from).toISOString())
  
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
  