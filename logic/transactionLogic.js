const { Transaction, User } = require('../db/db')
const debug = require('debug')('back:TransactionsErrors:')

/* Creates a user transaction in the DB */
const createTransaction = async (userId, action, info) => {
  try {
    const transaction = await Transaction.create({ userId, action, info })
    return transaction
  } catch (e) {
    debug(e.message, { userId, action, info })
  }
}

/* Gets all the transactions persisted in the DB */
const getTransactions = async (userId, action, info) => {
  const transactions = await Transaction.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'username', 'email'] }]
  })
  return transactions
}

module.exports = {
  createTransaction,
  getTransactions
}
