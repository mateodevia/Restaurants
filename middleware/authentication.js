const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1].toString()
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).send('TokenExpiredError')
        } else {
          res.status(403).send('Forbidden')
        }
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).send('Unauthorized')
  }
}
