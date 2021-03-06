module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: {
      type: Sequelize.STRING(1234),
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID
    }
  })

  return RefreshToken
}
