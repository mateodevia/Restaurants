require('dotenv').config()
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const chaiAsPromised = require('chai-as-promised')
const faker = require('faker')
chai.use(chaiAsPromised)
const expect = chai.expect
const sinon = require('sinon')
const authenticationLogic = require('../../logic/authenticationLogic')
const userLogin = require('../../logic/userLogic')
const { User, RefreshToken } = require('../../db/db')
const CustomError = require('../../utils/CustomError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

describe('Unit Tests: Authentication', () => {
  describe('Register', () => {
    beforeEach(() => {
      this.createStub = sinon.stub(User, 'create')
    })
    afterEach(() => {
      this.createStub.restore()
    })

    it('When registering a new user, then the user should be created on the DB', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      this.createStub.resolves()

      // Act
      await authenticationLogic.register(mockUser)

      // Assert
      expect(this.createStub).to.have.been.calledOnce
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      this.createRefreshStub = sinon.stub(RefreshToken, 'create')
      this.getUserByEmailStub = sinon.stub(userLogin, 'getUserByEmail')
    })
    afterEach(() => {
      this.getUserByEmailStub.restore()
      this.createRefreshStub.restore()
    })

    it('When the email is not register, then an error should be thrown', async () => {
      // Arrange
      const mockCredentials = {
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      this.getUserByEmailStub.rejects(new CustomError('User not found', 404))

      // Act
      const promise = authenticationLogic.login(mockCredentials)

      // Assert
      await expect(promise).to.be.rejectedWith('User not found')
    })

    it('When the password is incorrect, then an error should be thrown', async () => {
      // Arrange
      const mockCredentials = {
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      const encryptedPassword = await new Promise((resolve, reject) =>
        bcrypt.hash(faker.internet.password(9), 10, (err, hash) => {
          if (err) {
            reject(err)
          }
          resolve(hash)
        })
      )
      this.getUserByEmailStub.resolves({
        password: encryptedPassword
      })

      // Act
      const promise = authenticationLogic.login(mockCredentials)

      // Assert
      await expect(promise).to.be.rejectedWith('Invalid credentials')
    })

    it('When the credentials are valid, then a token should be return', async () => {
      // Arrange
      const mockPassword = faker.internet.password(8)
      const mockCredentials = {
        email: faker.internet.email(),
        password: mockPassword
      }
      const encryptedPassword = await new Promise((resolve, reject) =>
        bcrypt.hash(mockPassword, 10, (err, hash) => {
          if (err) {
            reject(err)
          }
          resolve(hash)
        })
      )
      this.getUserByEmailStub.resolves({
        password: encryptedPassword
      })

      // Act
      const response = await authenticationLogic.login(mockCredentials)

      // Assert
      expect(response.token).to.not.be.undefined
    })

    it('When the credentials are valid, then a refresh token should be return', async () => {
      // Arrange
      const mockPassword = faker.internet.password(8)
      const mockCredentials = {
        email: faker.internet.email(),
        password: mockPassword
      }
      const encryptedPassword = await new Promise((resolve, reject) =>
        bcrypt.hash(mockPassword, 10, (err, hash) => {
          if (err) {
            reject(err)
          }
          resolve(hash)
        })
      )
      this.getUserByEmailStub.resolves({
        password: encryptedPassword
      })

      // Act
      const response = await authenticationLogic.login(mockCredentials)

      // Assert
      expect(response.refreshToken).to.not.be.undefined
    })
  })

  describe('Refresh Token', () => {
    beforeEach(() => {
      this.findStub = sinon.stub(RefreshToken, 'findByPk')
    })
    afterEach(() => {
      this.findStub.restore()
    })

    it('When token does not exists, then an error should be thrown', async () => {
      // Arrange
      const mockToken = faker.lorem.word()
      this.findStub.resolves(null)

      // Act
      const promise = authenticationLogic.refreshToken(mockToken)

      // Assert
      await expect(promise).to.be.rejectedWith('Forbidden')
    })

    it('When no token is received, then an error should be thrown', async () => {
      // Arrange
      this.findStub.resolves(null)

      // Act
      const promise = authenticationLogic.refreshToken()

      // Assert
      await expect(promise).to.be.rejectedWith('Unauthorized')
    })

    it('When the token exists, then a new token should be returned', async () => {
      // Arrange
      const mockToken = `Bearer ${jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '1d'
      })}`
      this.findStub.resolves({
        token: mockToken
      })

      // Act
      const response = await authenticationLogic.refreshToken(mockToken)

      // Assert
      expect(response.token).to.not.be.undefined
    })
  })
})
