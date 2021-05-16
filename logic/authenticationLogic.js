const { RefreshToken, User } = require('../db/db')
const CustomError = require('../utils/CustomError')
const userLogic = require('../logic/userLogic')
const transationLogic = require('../logic/transactionLogic')
const transactions = require('../utils/Transactions')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* Creates a user in the DB with its password encripted */
const register = async (user) => {
  const existing = await User.findOne({
    where: {
      email: user.email
    }
  })
  if (existing) {
    throw new CustomError('Email already exists', 400)
  }
  user.password = await encryptPassword(user.password)
  const createdUser = await User.create(user)
  delete user.password
  await transationLogic.createTransaction(createdUser.id, transactions.REGISTER, user)
  return createdUser
}

/* Generates a pair of token if the credentials are valid */
const login = async ({ email, password }) => {
  const user = await userLogic.getUserByEmail(email)
  const correctPass = await comparePasswords(password, user.password)

  if (!correctPass) {
    await transationLogic.createTransaction(user.id, transactions.LOGIN, { success: false })
    throw new CustomError('Invalid credentials', 401)
  }
  const refreshToken = JWTRefreshToken(user)
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id
  })
  await transationLogic.createTransaction(user.id, transactions.LOGIN, { success: true })

  return {
    token: JWTSign(user),
    refreshToken: refreshToken
  }
}

/* Creates a new JWT if the refresh token exists in the database */
const refreshToken = async (token) => {
  if (!token) {
    throw new CustomError('Unauthorized', 401)
  }
  token = token.split(' ')[1]
  const fetchedRefreshToken = await RefreshToken.findByPk(token)

  if (!fetchedRefreshToken) {
    throw new CustomError('Forbidden', 403)
  }
  const user = await JWTSignFromRefreshToken(token)

  return {
    token: JWTSign(user)
  }
}

/* Invalidates refreshToken */
const logout = async (userId) => {
  console.log('va a borrar', userId)
  await RefreshToken.destroy({
    where: {
      userId
    }
  })

  return {
    msg: 'successs'
  }
}

/* Compares a plain text password with a given hash */
const comparePasswords = async (plain, hashed) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(plain, hashed, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  )
}

/* Creates a refresh token that expires on 1 day */
const JWTRefreshToken = ({ id, email, username }) => {
  return jwt.sign({ id, email, username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' })
}

/* Creates a JWT that expires on 15 minutes */
const JWTSign = ({ id, email, username }) => {
  return jwt.sign({ id, email, username }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  })
}

/* Extracts the user from a JWT */
const JWTSignFromRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) =>
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        reject(err)
      }
      resolve(user)
    })
  )
}

/* Encrypts a password with 10 levels of salt */
const encryptPassword = async (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err)
      }
      resolve(hash)
    })
  )
}

module.exports = {
  register,
  login,
  refreshToken,
  logout
}
