const authenticationLogic = require('../logic/authenticationLogic')

const register = async (req, res) => {
  const user = await authenticationLogic.register(req.body)
  res.send(user)
}

const login = async (req, res) => {
  const user = await authenticationLogic.login(req.body)
  res.send(user)
}

const refreshToken = async (req, res) => {
  const token = await authenticationLogic.refreshToken(
    req.headers.authorization
  )
  res.send(token)
}

module.exports = {
  register,
  login,
  refreshToken
}
