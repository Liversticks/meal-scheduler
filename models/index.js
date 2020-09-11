'use strict'
const sequelize = require('../config/db').sequelize
const User = require('./user')
const Meal = require('./meal')

User.hasMany(Meal)
Meal.belongsTo(User)

sequelize.sync({ force: false }).then(() => { console.log("Database ready") })

module.exports = { sequelize, User, Meal }
