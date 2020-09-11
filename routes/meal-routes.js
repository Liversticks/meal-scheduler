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

  app.get('/api/meals', [authJWT.verifyToken], controller.getMeals)

  app.post('/api/meals', [authJWT.verifyToken], controller.createMeal)

  app.delete('/api/meals', [authJWT.verifyToken], controller.deleteMeal)

  app.put('/api/meals', [authJWT.verifyToken], controller.updateMeal)
}
