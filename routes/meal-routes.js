const authJWT = require('../middleware/authJWT')
const controller = require('../controllers/meal-controller')

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get('/', controller.test)

  app.get('/main', [authJWT.verifyToken], controller.loginTest)

  app.get('/meals', [authJWT.verifyToken], controller.getMeals)

  app.post('/meals', [authJWT.verifyToken], controller.createMeal)

  app.delete('/meals', [authJWT.verifyToken], controller.deleteMeal)

  app.put('/meals', [authJWT.verifyToken], controller.updateMeal)
}
