require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const errorHandler = require('./middleware/errorHandler')
const db = require('./db/db')
db.sequelize.sync()
const authRouter = require('./routes/authentication')
const usersRouter = require('./routes/users')
const restaurantsRouter = require('./routes/restaurants')
const transactionsRouter = require('./routes/transactions')

const app = express()

// middlewares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/authentication', authRouter)
app.use('/users', usersRouter)
app.use('/restaurants', restaurantsRouter)
app.use('/transactions', transactionsRouter)

// error handler
app.use(errorHandler)

module.exports = app
