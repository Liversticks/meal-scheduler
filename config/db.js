//database setup based on this:
//https://stackoverflow.com/questions/47538043/sequelize-typeerror-user-hasmany-is-not-a-function

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.LOCALDATABASE)

module.exports = { sequelize }
