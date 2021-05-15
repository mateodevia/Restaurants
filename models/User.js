module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  )
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())

    delete values.password
    delete values.deletedAt
    return values
  }
  const Transaction = sequelize.define(
    'Transaction',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      action: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.JSON
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  )
  Transaction.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  })
  return { User, Transaction }
}
