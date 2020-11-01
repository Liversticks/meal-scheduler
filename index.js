const express = require('express')
const dotenv = require('dotenv').config()
const http = require('http')
const path = require('path')
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
app.use(express.static(path.join(__dirname, 'build')))
app.use('/static', express.static(path.join(__dirname, 'public/uploads')))

const authAPI = require('./routes/auth-route')
app.use('/api/auth', authAPI)

const mealAPI = require('./routes/meal-routes')
app.use('/api/meals', mealAPI)

const userAPI = require('./routes/user-routes')
app.use('/api/users', userAPI)


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


http.createServer(app).listen(PORT, "0.0.0.0", () => { console.log(`Listening on ${PORT}`)})
