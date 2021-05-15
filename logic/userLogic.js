const { User } = require('../db/db')
const CustomError = require('../utils/CustomError')

/* Retrieves all the users from the DB. */
const getUsers = async () => {
  const users = await User.findAll()
  return users
}

/* Retrieves a specific from the DB by id */
const getUser = async (userId) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new CustomError('User not found', 404)
  }
  return user
}

/* Retrieves a specific from the DB by email */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new CustomError('User not found', 404)
  }
  return user
}

/* Updates a specific from the DB by id */
const updateUser = async (userId, userBody) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new CustomError('User not found', 404)
  }
  Object.assign(user, userBody)
  await user.save()
  return user
}

/* deletes a specific from the DB by id */
const deleteUser = async (userId, userBody) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new CustomError('User not found', 404)
  }
  const res = await user.destroy()
  return res
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser
}
