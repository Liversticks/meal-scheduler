const authJWT = require('../middleware/authJWT')
const controller = require('../controllers/user-controller')
const express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  )
  next()
})

router.get('/', [authJWT.verifyToken], controller.getUser)

router.post('/', [authJWT.verifyToken], controller.uploadImage)

router.delete('/', [authJWT.verifyToken], controller.deleteImage)

module.exports = router
