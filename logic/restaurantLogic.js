const google = require('../utils/GoogleUtils')
const transationLogic = require('../logic/transactionLogic')
const transactions = require('../utils/Transactions')

/* Gets restaurants near by */
const getRestaurants = async (userId, { type, lat, long, city }) => {
  let restaurants
  if (type === 'LOCATION') {
    restaurants = await google.getRestaurantsByLocation(lat, long)
  } else {
    restaurants = await google.getRestaurantsByCity(city)
  }
  await transationLogic.createTransaction(userId, transactions.GET_CITIES, { type, lat, long, city })
  return restaurants
}

module.exports = {
  getRestaurants
}
