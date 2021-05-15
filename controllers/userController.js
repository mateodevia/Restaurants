const userLogic = require('../logic/userLogic')

const getUsers = async (req, res) => {
  const users = await userLogic.getUsers()
  res.send(users)
}

const getUser = async (req, res) => {
  const user = await userLogic.getUser(req.params.userId)
  res.send(user)
}

const updateUser = async (req, res) => {
  const user = await userLogic.updateUser(req.params.userId, req.body)
  res.send(user)
}

const deleteUser = async (req, res) => {
  const user = await userLogic.deleteUser(req.params.userId)
  res.send(user)
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser
}
