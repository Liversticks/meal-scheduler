'use strict'
const Sequelize = require('sequelize')
const sequelize = require('../config/db').sequelize
const db = require('./index.js')

const tableName = 'meals'

const Meal = sequelize.define('meal', {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    unique: 'compositeIndex',
    validate: {
      notEmpty: true
    }
  },
  meal_type: {
    type: Sequelize.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    allowNull: false,
    unique: 'compositeIndex',
    validate: {
      notEmpty: true
    }
  },
  meal_desc: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, { tableName })

module.exports = Meal
