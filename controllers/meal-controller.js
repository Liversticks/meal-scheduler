const db = require('../models/index.js')
const Meal = db.Meal
const Calendar = db.Calendar
const oper = require('sequelize').Op
const moment = require('moment')



function clumpDates(accumulator, currentValue) {
  //get date from currentValue
  //check to see if accumulator has date as a key
  //if yes, then store currentValue['meal_desc'] and currentValue['userUsername']
  //under accumulator[date][currentValue['meal_type']]
  //otherwise, create the meal type and file the description/chef
  let dateKey = moment(currentValue['meal_date']).format("L")
  accumulator[dateKey][currentValue['meal_type']]['meal_desc'] = currentValue['meal_desc']
  accumulator[dateKey][currentValue['meal_type']]['chef'] = currentValue['chef']
  return accumulator
}

function matchHolidays(accumulator, currentValue) {
  let dateKey = moment(currentValue['date']).format("L")
  accumulator[dateKey] = {
    breakfast: {},
    lunch: {},
    dinner: {},
    snack: {},
    holiday: currentValue['holiday']
  }
  return accumulator
}

module.exports = {

  getMeals: (req, res) => {
    let today = moment().startOf('day')
    let fiveWeeks = today.clone().add(35, 'd')
    Calendar.findAll({
      attributes: [
        'date',
        'holiday'
      ],
      where: {
        date: {
          [oper.gte]: today.toDate(),
          [oper.lte]: fiveWeeks.toDate()
        }
      }
    }).then(dateRes => {
      Meal.findAll({
        attributes: [
          'meal_date',
          'meal_type',
          'meal_desc',
          'chef'
        ],
        where: {
          meal_date: {
            [oper.gte]: today.toDate(),
            [oper.lte]: fiveWeeks.toDate()
          }
        },
        order: [
          ['meal_date', 'ASC']
        ]
      }).then(mealRes => {
        let retObj = mealRes.reduce(clumpDates, dateRes.reduce(matchHolidays, {}))
        res.status(200).send(retObj)
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  },

  createMeal: (req, res) => {
    Meal.create({
      meal_date: moment(req.body.meal_date, 'MM/DD/YYYY').toDate(),
      meal_type: req.body.meal_type.toLowerCase(),
      meal_desc: req.body.meal_desc,
      chef: req.username
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
        meal_date: moment(req.body.meal_date, 'MM/DD/YYYY').toDate(),
        meal_type: req.body.meal_type,
        chef: req.username
      }
    }).then((dbRes) => {
      if (dbRes.length > 0 && dbRes[0] > 0) {
        return res.status(200).send({
          message: 'Meal details updated successfully!'
        })
      }
      return res.status(404).send({
        message: `Could not update as no ${req.body.meal_type} currently exists for ${req.body.meal_date}.`
      })
    }).catch(err => {
      return res.status(500).send({
        message: err.message
      })
    })
  },

  deleteMeal: (req, res) => {
    Meal.destroy({
      where: {
        meal_date: moment(req.body.meal_date, 'MM/DD/YYYY').toDate(),
        meal_type: req.body.meal_type
      }
    }).then((dbRes) => {
      if (dbRes === 1) {
        return res.status(200).send({
          message: 'Meal successfully deleted.'
        })
      }
      return res.status(404).send({
        message: 'This meal does not exist so was not deleted.'
      })

    }).catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
  }
}
