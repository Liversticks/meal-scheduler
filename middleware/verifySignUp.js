const db = require('../models/index.js')
const User = db.User

module.exports = {
  checkDuplicate: (req, res, next) => {
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
    })
  }
}
