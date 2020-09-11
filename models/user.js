'use strict'
const Sequelize = require('sequelize')
const sequelize = require('../config/db').sequelize
const db = require('./index.js')

const tableName = "users"

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING(20),
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, { tableName })

module.exports = User
