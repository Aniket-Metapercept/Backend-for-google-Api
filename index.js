const express = require('express')
const app = express()
const cookieSession = require('cookie-session')

const passport = require('passport')
const cors = require('cors')

const auth_route = require('./routes/auth')
const google_cal = require('./routes/google_events')
 
require('./passport')

app.use(express.json())



app.use(cors({ 
    origin:'http://localhost:4200',
    methods: "GET,POST,PUT,DELETE",
    credentials:true
}))

app.use(cookieSession({
    name:'session',
    keys:['aniket'],
    maxAge:24*60*60*100
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('/auth',auth_route)
app.use('/google_calender',google_cal)

app.listen(3000,()=>{
    console.log("Server is running...")
})

