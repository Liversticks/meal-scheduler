const controller = require('../controllers/auth-controller')
const verifySignUp = require('../middleware/verifySignUp')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post('/api/signup', [verifySignUp.checkDuplicate], controller.signup)

  app.post('/api/login', controller.login)
}
