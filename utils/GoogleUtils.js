const axios = require('axios').default

const getRestaurantsByLocation = async (lat, long) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/search/json?location=${lat},${long}&radius=500&sensor=false&key=${process.env.GOOGLE_API_KEY}&types=restaurant`)
  return response.data.results
}

const getRestaurantsByCity = async (city) => {
  return []
}

module.exports = {
  getRestaurantsByLocation,
  getRestaurantsByCity
}
