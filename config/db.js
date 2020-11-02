//database setup based on this:
//https://stackoverflow.com/questions/47538043/sequelize-typeerror-user-hasmany-is-not-a-function

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.LOCALDATABASE, {
  dialect: 'postgres',
  protocol: 'tcp',
  logging: (process.env.NODE_ENV === 'test' ? () => {} : console.log())
})

module.exports = { sequelize }
