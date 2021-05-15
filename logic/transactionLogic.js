const { Transaction } = require('../db/db')

/* Creates a user transaction in the DB */
const createTransaction = async (userId, action, info) => {
  const transaction = await Transaction.create({ userId, action, info })

  return transaction
}

module.exports = {
  createTransaction
}
