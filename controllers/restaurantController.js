const restaurantLogic = require('../logic/restaurantLogic')

const getRestaurants = async (req, res) => {
  const users = await restaurantLogic.getRestaurants(req.user.id, req.query)
  res.send(users)
}

module.exports = {
  getRestaurants
}
