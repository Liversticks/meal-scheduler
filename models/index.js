'use strict'
const Sequelize = require('sequelize')
const sequelize = require('../config/db').sequelize
const ENVIRON = process.env.NODE_ENV === 'production' ? false : true
const moment = require('moment')
const holidayCheck = require('./holiday-rules')


const Calendar = sequelize.define('calendar', {
  date: {
    type: Sequelize.DATEONLY,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  holiday: {
    type: Sequelize.STRING(20),
    allowNull: true,
  }

})

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
  },
  birthday: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

const Meal = sequelize.define('meal', {
  meal_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    references: {
      model: Calendar,
      key: 'date'
    },
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
  },
  chef: {
    type: Sequelize.STRING(20),
    references: {
      model: User,
      key: 'username'
    },
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})


//from the starting date, create dates up to INTERVAL days away
let insertDates = []
let timeCounter = moment().startOf('day')
let timeEnd = timeCounter.clone().add(75, 'd')
while (timeCounter.isSameOrBefore(timeEnd, 'day')) {
  insertDates.push({
    date: timeCounter.toDate(),
    holiday: holidayCheck.isHoliday(timeCounter)
  })
  timeCounter = timeCounter.clone().add(1, 'd')
}


//bulk create dates

//after one day, create a new entry one day after timeEnd
//const ONE_DAY = 1000
const ONE_DAY = 24 * 3600 * 1000

sequelize.sync({ force: ENVIRON }).then(() => {
  Calendar.bulkCreate(insertDates).then(() => {
    console.log("Database ready");
    setInterval(() => {
      let insertObj = {
        date: timeCounter.toDate(),
        holiday: 'test'
      }
      timeCounter = timeCounter.clone().add(1, 'd')
      Calendar.create(insertObj)
    }, ONE_DAY)
  })
}).then(() => {
  if (ENVIRON) {
    const bcrypt = require('bcrypt')
    User.create({
      username: process.env.LOCAL_USERNAME,
      email: process.env.LOCAL_EMAIL,
      password: bcrypt.hashSync(process.env.LOCAL_PASSWORD, 10),
      birthday: moment(process.env.LOCAL_BIRTHDAY, "YYYY-MM-DD").toDate()
    })
  }
})

module.exports = { Calendar, User, Meal }
