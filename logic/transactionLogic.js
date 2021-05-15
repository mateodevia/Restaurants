const { Transaction } = require('../db/db')
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

module.exports = {
  createTransaction
}
