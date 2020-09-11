const db = require('../models/index.js')
const Meal = db.Meal
const oper = require('sequelize').Op
const moment = require('moment')



function clumpDates(accumulator, currentValue) {
  //get date from currentValue
  //check to see if accumulator has date as a key
  //if yes, then store currentValue['meal_desc'] and currentValue['userUsername']
  //under accumulator[date][currentValue['meal_type']]
  //otherwise, create the meal type and file the description/chef
  let dateKey = moment(currentValue.date).format("L")
  if (!accumulator.hasOwnProperty(dateKey)) {
    accumulator[dateKey] = {
      breakfast: {},
      lunch: {},
      dinner: {},
      snack: {}
    }
  }
  accumulator[dateKey][currentValue['meal_type']]['meal_desc'] = currentValue['meal_desc']
  accumulator[dateKey][currentValue['meal_type']]['chef'] = currentValue['userUsername']
  return accumulator
}

module.exports = {
  test: (req, res) => {
    res.status(200).send({
      message: "Test message."
    })
  },

  loginTest: (req, res) => {
    console.log(req.username)
    res.status(200).send({
      message: "Logged in."
    })
  },

  getMeals: (req, res) => {
    let today = moment().startOf('day')
    let fiveWeeks = today.clone().add(35, 'd')
    Meal.findAll({
      attributes: [
        'date',
        'meal_type',
        'meal_desc',
        'userUsername'
      ],
      where: {
        date: {
          [oper.gte]: today.toDate(),
          [oper.lte]: fiveWeeks.toDate()
        }
      },
      order: [
        ['date', 'ASC']
      ]
    }).then(dbRes => {
      /*
      result object:
      [
        {

        }

      ]
      */
      res.status(200).send(dbRes.reduce(clumpDates, {}))
    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  },

  createMeal: (req, res) => {
    Meal.create({
      date: req.body.date,
      meal_type: req.body.meal_type,
      meal_desc: req.body.meal_desc,
      userUsername: req.username
    }).then(() => {
      res.status(201).send({
        message: 'Meal scheduled successfully!'
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  },

  updateMeal: (req, res) => {
    Meal.update({
      meal_desc: req.body.meal_desc
    }, {
      where: {
        date: req.body.date,
        meal_type: req.body.meal_type,
        userUsername: req.username
      }
    }).then(() => {
      res.status(200).send({
        message: 'Meal details updated successfully!'
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  },

  deleteMeal: (req, res) => {
    Meal.destroy({
      where: {
        date: moment(req.body.date, 'MM-DD-YYYY').toDate(),
        meal_type: req.body.meal_type
      }
    }).then(() => {
      res.status(200).send({
        message: 'Meal successfully deleted.'
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  }
}
