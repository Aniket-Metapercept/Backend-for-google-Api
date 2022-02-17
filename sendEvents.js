// Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth
    
const oAuth2Client = new OAuth2(
    '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com','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'
)
// Create a new instance of oAuth and set our Client ID & Client Secret.
// const oAuth2Client = new OAuth2(
//     '882169501564-sqand4jd76eg9afh0j7hpi6kl2gdie8d.apps.googleusercontent.com','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'
// )
const addEventToGoogleCalender = (data)=> {

    var { summary, description, to, from, location, token }  = data

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

    console.log('data =>',data.summary )
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
    (err, res) => {
        // Check for errors in our query and log them if they exist.
        if (err) {
            console.error('Free Busy Query Error: ', err)
            return false
            }
        // Create an array of all events on our calendar during that time.
        const eventArr = res.data.calendars.primary.busy
        console.log(eventArr)
        // Check if event array is empty which means we are not busy
        if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
            { calendarId: 'primary', resource: event },
            err => {
            // Check for errors and log them if they exist.

            // if (err) return console.error('Error Creating Calender Event:', err)
            
            if (err) return false
            // Else log that the event was created.
            // return console.log('Calendar event successfully created.')
            return true
            }
        )

        // If event array is not empty log that we are busy.
        return console.log(`Sorry I'm busy...`)
    }
    )

}




const getAllEvents  =  () =>{

        

        oAuth2Client.setCredentials({
            // refresh_token: '1//04deCcZm249pKCgYIARAAGAQSNwF-L9IrIPLC5701gQNTJnYCiP9IEsCknDwfCern77Bn6NlP65CER2_GGiLXBSJMxWr3Z_NwhIQ',
            access_token: 'ya29.A0ARrdaM8PWaUjdYDGYcTbgs0IrLa0pEPoZPMD_p5Mcnf_3j5E7BKdLvTdYurc32eAzRtZuHRYiqVqx0k5GzgA1WKD1pGIXy2N4ir2j7__hk4IEfXggXmANx5ofPGmDY7l8hqtGUyi3medRAgHVMKLkPuVa8t9'
            // access_token:'ya29.A0ARrdaM-JNPquZ9i5gCCO1g6SvAkdVq_ibQJx2Kq7x5n6q0lFMFxnElmR42tDtIl-ppCWw_zJD5y230v8fZOxPOCmWELoKaWVAI7Qo1M6W28ChepX7_9hdZtsf5o8DT0KA5EoTuAwNqdKSK1QLbB__cktwSPS'
        }) 
        // Create a new calender instance.
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  
      //   return calendar.events.insert(
          // { calendarId: 'primary', resource: event },
  
          async function  listUpcomingEvents() {
              calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
              // 'timeMax': '2022-03-17T06:22:50.205Z',
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
              }).then(function(response) {
                  // console.log(response.data.items)
                  
                var events = response.data.items; 
                console.log(events.length)
                console.log('Upcoming events:');
      
                if (events.length > 0) {
                  for (i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                      when = event.start.date;
                    }
                    console.log(event.summary + ' (' + when + ')')
                   
                }
                } else {
                  console.log('No upcoming events found.');
                }
              });
            } 
    var data = []
    listUpcomingEvents()

    return data
}

















module.exports = {
    addEventToGoogleCalender,
    getAllEvents
}