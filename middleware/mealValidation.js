let calendarRegex = /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(\d{4})$/
let mealTypeRegex = /breakfast|lunch|dinner|snack/i

module.exports = {
  mealUpdate: (req, res, next) => {
    if (req.body.hasOwnProperty('meal_date')) {
      if (calendarRegex.test(req.body['meal_date'])) {
        if (req.body.hasOwnProperty('meal_type') && mealTypeRegex.test(req.body['meal_type'])) {
          if (req.body.hasOwnProperty('meal_desc') && req.body['meal_desc'].length > 0) {
            next()
          } else {
            return res.status(400).send({
              message: 'No meal description provided.'
            })
          }
        } else {
          return res.status(400).send({
            message: 'No meal type provided (breakfast, lunch, dinner, or snack).'
          })
        }
      } else {
        return res.status(400).send({
          message: 'Invalid date format provided (use MM/DD/YYYY).'
        })
      }
    } else {
      return res.status(400).send({
        message: 'No meal date provided.'
      })
    }
  },

  mealDelete: (req, res, next) => {
    if (req.body.hasOwnProperty('meal_date')) {
      if (calendarRegex.test(req.body['meal_date'])) {
        if (req.body.hasOwnProperty('meal_type') && mealTypeRegex.test(req.body['meal_type'])) {
          next()
        } else {
          return res.status(400).send({
            message: 'No meal type provided (breakfast, lunch, dinner, or snack).'
          })
        }
      } else {
        return res.status(400).send({
          message: 'Invalid date format provided (use MM/DD/YYYY).'
        })
      }
    } else {
      return res.status(400).send({
        message: 'No meal date provided.'
      })
    }
  }
}
