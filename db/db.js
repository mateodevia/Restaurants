const { Sequelize } = require('sequelize')
const debug = require('debug')('db')
const credentials = require('./credentials')[process.env.NODE_ENV]
debug('Connecting to database')

const sequelize = new Sequelize(credentials, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 30,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

sequelize
  .authenticate()
  .then(() => {
    debug('Connection has been established successfully.')
  })
  .catch((err) => {
    debug('Unable to connect to the database:', err)
  })

const db = {
  sequelize,
  Sequelize
}

db.User = require('../models/User')(sequelize, Sequelize)
db.RefreshToken = require('../models/RefreshToken')(sequelize, Sequelize)

module.exports = db
