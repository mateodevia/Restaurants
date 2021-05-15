require('dotenv').config()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const faker = require('faker')
chai.use(chaiAsPromised)
const expect = chai.expect
const request = require('supertest')
const dbUtils = require('../utils/dbUtils')

const server = require('../../bin/www')

describe('Integration Tests: Authentication', () => {
  after(async () => {
    server.close()
  })

  describe('POST /authentication/register', () => {
    beforeEach(async () => {
      await dbUtils.resetDB()
    })
    it('When information is valid, then it should return the created object', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      const { email, name, username } = res.body
      // Assert
      expect({
        name,
        username,
        email
      }).to.deep.equal({
        name: mockUser.name,
        username: mockUser.username,
        email: mockUser.email
      })
    })
    it('When the name is not defined, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the username is not defined, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(8)
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the email is not defined, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        password: faker.internet.password(8)
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the email is invalid, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email: faker.lorem.word(),
        password: faker.internet.password(7)
      }
      // Arrange
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the password is not defined, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email: faker.internet.email()
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the password has less than 8 characters, then it should return 400', async () => {
      // Arrange
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(7)
      }
      // Act
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      // Assert
      expect(res.status).to.equal(400)
    })
  })

  describe('POST /authentication/login', () => {
    let email
    let password
    beforeEach(async () => {
      await dbUtils.resetDB()
      email = faker.internet.email()
      password = faker.internet.password(8)
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email,
        password
      }
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      expect(res.status).to.equal(200)
    })
    it('When the credentials are valid, then it should return a token', async () => {
      // Arrange
      const mockCredentials = {
        email,
        password
      }
      // Act
      const res = await request(server)
        .post('/authentication/login')
        .send(mockCredentials)
      // Assert
      expect(res.body.token).to.not.be.undefined
    })
    it('When the credentials are valid, then it should return a refresh token', async () => {
      // Arrange
      const mockCredentials = {
        email,
        password
      }
      // Act
      const res = await request(server)
        .post('/authentication/login')
        .send(mockCredentials)
      // Assert
      expect(res.body.refreshToken).to.not.be.undefined
    })
    it('When the credentials are invalid, then it should return 401', async () => {
      // Arrange
      const mockCredentials = {
        email,
        password: faker.internet.password(10)
      }
      // Act
      const res = await request(server)
        .post('/authentication/login')
        .send(mockCredentials)
      // Assert
      expect(res.status).to.equal(401)
    })
    it('When the email is not defined, then it should return 400', async () => {
      // Arrange
      const mockCredentials = {
        password
      }
      // Act
      const res = await request(server)
        .post('/authentication/login')
        .send(mockCredentials)
      // Assert
      expect(res.status).to.equal(400)
    })
    it('When the password is not defined, then it should return 400', async () => {
      // Arrange
      const mockCredentials = {
        email
      }
      // Act
      const res = await request(server)
        .post('/authentication/login')
        .send(mockCredentials)
      // Assert
      expect(res.status).to.equal(400)
    })
  })

  describe('POST /authentication/refresh', () => {
    let token
    let refreshToken
    beforeEach(async () => {
      await dbUtils.resetDB()
      const email = faker.internet.email()
      const password = faker.internet.password(8)
      const mockUser = {
        name: faker.name.firstName(),
        username: faker.internet.userName(),
        email,
        password
      }
      const res = await request(server)
        .post('/authentication/register')
        .send(mockUser)
      expect(res.status).to.equal(200)

      const resLogin = await request(server)
        .post('/authentication/login')
        .send({ email, password })

      token = resLogin.body.token
      refreshToken = resLogin.body.refreshToken
      expect(resLogin.status).to.equal(200)
    })
    it('When the refresh token is valid, then it should return a new token', async () => {
      // Arrange
      // Act
      const res = await request(server)
        .post('/authentication/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
      // Assert
      expect(res.body.token).to.not.be.undefined
    })
    it('When the refresh token is invalid, then it should return 403', async () => {
      // Arrange
      // Act
      const res = await request(server)
        .post('/authentication/refresh')
        .set('Authorization', `Bearer ${faker.random.word()}`)
      // Assert
      expect(res.status).to.equal(403)
    })
    it('When there is no refresh token, then it should return 401', async () => {
      // Arrange
      // Act
      const res = await request(server).post('/authentication/refresh')
      // Assert
      expect(res.status).to.equal(401)
    })
  })
})
