const express = require('express')
const dotenv = require('dotenv').config()
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 5000


let app = express()

/*
let corsOptions = {
  origin: "http://localhost:" + REACTPORT
}
*/

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./routes/auth-route')(app)
require('./routes/meal-routes')(app)



http.createServer(app).listen(PORT, "0.0.0.0", () => { console.log(`Listening on ${PORT}`)})
