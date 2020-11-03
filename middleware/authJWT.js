const jwt = require('jsonwebtoken')
const auth = require('../config/auth')
const db = require('../models/index.js')
const user = db.User

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  if (!token) {
    return res.status(401).send({
      message: "Token not provided."
    })
  }

  jwt.verify(token, auth.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Not authorized."
      })
    }
    req.username = decoded.username
    req.email = decoded.email
    next()
  })
}

const authJWT = {
  verifyToken: verifyToken
}

module.exports = authJWT
