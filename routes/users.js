const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/authentication')
const wrap = require('../middleware/asyncWrapper')
const { validate, Joi } = require('express-validation')

// Validations
const userUpdateValidation = validate(
  {
    body: Joi.object({
      name: Joi.string(),
      username: Joi.string()
    })
  },
  { keyByField: true }
)

/* GET users listing. */
router.get('/', auth, wrap(userController.getUsers))

/* GET user by id */
router.get('/:userId', wrap(userController.getUser))

/* PATCH user by id */
router.patch('/:userId', userUpdateValidation, wrap(userController.updateUser))

/* DELETE user by id */
router.delete('/:userId', wrap(userController.deleteUser))

module.exports = router
