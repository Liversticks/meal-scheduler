const authJWT = require('../middleware/authJWT')
const controller = require('../controllers/meal-controller')
const express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  )
  next()
})

router.get('/', [authJWT.verifyToken], controller.getMeals)

router.post('/', [authJWT.verifyToken], controller.createMeal)

router.delete('/', [authJWT.verifyToken], controller.deleteMeal)

router.put('/', [authJWT.verifyToken], controller.updateMeal)

module.exports = router
