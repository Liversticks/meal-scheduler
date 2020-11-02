const db = require('../models/index.js')
const User = db.User

module.exports = {
  checkDuplicate: (req, res, next) => {
    if (req.body.hasOwnProperty('username')) {
      if (req.body.hasOwnProperty('birthday')) {
        if (req.body.hasOwnProperty('email')) {
          if (req.body.hasOwnProperty('password')) {
            User.findOne({
              where: {
                username: req.body.username
              }
            })
            .then(user => {
              if (user) {
                return res.status(400).send({
                  message: "Username already taken."
                })
              }
              User.findOne({
                where: {
                  email: req.body.email
                }
              })
              .then(user => {
                if (user) {
                  return res.status(400).send({
                    message: "Email already taken."
                  })
                }
                next()
              })
            }).catch(err => {
              return res.status(400).send({
                message: err.message
              })
            })
          } else {
            return res.status(400).send({
              message: 'To create a new user, please provide a password.'
            })
          }
        } else {
          return res.status(400).send({
            message: 'To create a new user, please provide an email.'
          })
        }
      } else {
        return res.status(400).send({
          message: 'To create a new user, please provide a birthday.'
        })
      }
    } else {
        return res.status(400).send({
          message: 'To create a new user, please provide a username.'
        })
    }

  }
}
