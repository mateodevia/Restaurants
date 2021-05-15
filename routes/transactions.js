
const express = require('express')
const router = express.Router()
const wrap = require('../middleware/asyncWrapper')
const transactionController = require('../controllers/transactionController')

/* GET users listing. */
router.get('/', wrap(transactionController.getTransactions))

module.exports = router
