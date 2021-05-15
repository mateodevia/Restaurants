require('dotenv').config()
const db = require('../db/db')

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Tables are successfully created')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
