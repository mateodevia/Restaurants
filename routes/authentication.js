const express = require('express')
const router = express.Router()
const authenticationControler = require('../controllers/authenticationController')
const wrap = require('../middleware/asyncWrapper')
const auth = require('../middleware/authentication')
const { validate, Joi } = require('express-validation')

// Validations
const registerValidation = validate(
  {
    body: Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    })
  },
  { keyByField: true }
)

const loginValidation = validate(
  {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    })
  },
  { keyByField: true }
)

/* POST registers a new user */
router.post(
  '/register',
  registerValidation,
  wrap(authenticationControler.register)
)

/* GET allows a user to log in with its credentials */
router.post('/login', loginValidation, wrap(authenticationControler.login))

/* GET generates a new JWT from a refresh token */
router.post('/refresh', wrap(authenticationControler.refreshToken))

/* DELETE generates a new JWT from a refresh token */
router.delete('/logout', auth, wrap(authenticationControler.logout))

module.exports = router
