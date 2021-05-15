
const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const wrap = require('../middleware/asyncWrapper')
const restaurantController = require('../controllers/restaurantController')
const { validate, Joi } = require('express-validation')

// Validations
const queryValidation = validate(
  {
    query: Joi.object({
      type: Joi.string().required().valid('CITY', 'LOCATION'),
      long: Joi.alternatives().conditional('type', { is: 'LOCATION', then: Joi.number().required() }),
      lat: Joi.alternatives().conditional('type', { is: 'LOCATION', then: Joi.number().required() }),
      city: Joi.alternatives().conditional('type', { is: 'CITY', then: Joi.string().required() })
    })
  },
  { keyByField: true }
)

/* GET users listing. */
router.get('/', auth, queryValidation, wrap(restaurantController.getRestaurants))

module.exports = router
