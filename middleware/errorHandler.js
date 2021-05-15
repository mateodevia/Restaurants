const CustomError = require('../utils/CustomError')
const { ValidationError } = require('express-validation')
module.exports = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).send({
      error: err.message
    })
  } else if (err instanceof ValidationError) {
    const { error, details } = err
    res.status(400).send({ error, details })
  } else {
    res.status(500).send('Unexpected Error')
  }
}
