const controller = require('../controllers/auth-controller')
const verifySignUp = require('../middleware/verifySignUp')
const express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  )
  next()
})

router.post('/signup', [verifySignUp.checkDuplicate], controller.signup)

router.post('/login', controller.login)

module.exports = router
