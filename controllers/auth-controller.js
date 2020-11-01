const db = require('../models/index.js')
const auth = require('../config/auth')
const User = db.User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')

module.exports = {

  signup: (req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      birthday: moment(req.body.birthday, "YYYY-MM-DD").toDate()
    }).then(() => {
      res.status(200).send({
        message: "Signed up successfully!"
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  },

  login: (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          accessToken: null,
          message: "Authentication error - invalid username or password."
        })
      }

      let validPass = bcrypt.compareSync(req.body.password, user.password)
      if (!validPass) {
        return res.status(401).send({
          accessToken: null,
          message: "Authentication error - invalid username or password."
        })
      }

      let token = jwt.sign({
        username: user.username
      }, auth.secret, {
        expiresIn: 43200
      })

      res.status(200).send({
        accessToken: token
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  }
}
