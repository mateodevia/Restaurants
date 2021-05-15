const axios = require('axios').default

const getRestaurantsByLocation = async (lat, long) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/search/json?location=${lat},${long}&radius=500&sensor=false&key=${process.env.GOOGLE_API_KEY}&types=restaurant`)
  return response.data.results
}

const getRestaurantsByCity = async (city) => {
  const { lat, lng } = await getCityLocation(city)
  console.log({ lat, lng })
  return getRestaurantsByLocation(lat, lng)
}

const getCityLocation = async (city) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GOOGLE_API_KEY}`)
  return response.data.results[0].geometry.location
}

module.exports = {
  getRestaurantsByLocation,
  getRestaurantsByCity
}
