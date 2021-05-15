const db = require('../../db/db')

const resetDB = async () => db.sequelize.sync({ force: true })
module.exports = {
  resetDB
}
