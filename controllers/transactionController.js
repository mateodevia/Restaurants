const transactionLogic = require('../logic/transactionLogic')

const getTransactions = async (req, res) => {
  const transactions = await transactionLogic.getTransactions()
  res.send(transactions)
}

module.exports = {
  getTransactions
}
