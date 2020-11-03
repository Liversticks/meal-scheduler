process.env.NODE_ENV = 'test'

let jwt = require('jsonwebtoken')
let auth = require('../config/auth')
let moment = require('moment')

let token = jwt.sign({
  username: process.env.LOCAL_USERNAME
}, auth.secret, {
  expiresIn: 43200
})

let fakeToken = jwt.sign({
  username: 'process.env.LOCAL_USERNAME'
}, 'bruh', {
  expiresIn: 69420
})

let chai = require('chai')
let chaiHTTP = require('chai-http')
let server = require('../index.js')
let should = chai.should()
let expect = chai.expect

chai.use(chaiHTTP)

describe('meal scheduler server', () => {
  before((done) => {
    setTimeout(done, 1000)
  })
  describe('POST /api/auth/signup', () => {
    // give time for the database to load


    it('should create a new user with all fields', (done) => {
      let user1 = {
        username: 'test',
        email: 'real_email@test.com',
        password: 'totallysecurepass',
        birthday: '1970-01-01'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user1)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Signed up successfully!')
          done()
        })
    })
    it('should fail to create a new user when missing username', (done) => {
      let user2 = {
        email: 'real_email1@test.com',
        password: 'totallysecurepass',
        birthday: '1970-01-01'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user2)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('To create a new user, please provide a username.')
          done()
        })
    })
    it('should fail to create a new user when missing birthday', (done) => {
      let user3 = {
        username: 'test3',
        password: 'totallysecurepass',
        email: 'real_email2@test.com'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user3)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('To create a new user, please provide a birthday.')
          done()
        })
    })
    it('should fail to create a new user when missing email', (done) => {
      let user4 = {
        username: 'test4',
        password: 'totallysecurepass',
        birthday: '1970-02-02'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user4)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('To create a new user, please provide an email.')
          done()
        })
    })
    it('should fail to create a new user when missing password', (done) => {
      let user5 = {
        username: 'test5',
        email: 'real_email3@test.com',
        birthday: '1970-02-02'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user5)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('To create a new user, please provide a password.')
          done()
        })
    })
    it('should fail to create a new user when username is duplicated', (done) => {
      let user6 = {
        username: process.env.LOCAL_USERNAME,
        email: 'real_email4@test.com',
        password: 'totallysecurepass',
        birthday: '1970-02-02'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user6)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Username already taken.')
          done()
        })
    })
    it('should fail to create a new user when email is duplicated', (done) => {
      let user7 = {
        username: 'test6',
        email: process.env.LOCAL_EMAIL,
        password: 'totallysecurepass',
        birthday: '1970-02-02'
      }
      chai.request(server)
        .post('/api/auth/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user7)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Email already taken.')
          done()
        })
    })
  })
  describe('POST /api/auth/login', () => {
    it('should login when valid credentials are provided', (done) => {
      let login1 = {
        username: process.env.LOCAL_USERNAME,
        password: process.env.LOCAL_PASSWORD
      }
      chai.request(server)
        .post('/api/auth/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(login1)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.accessToken.should.exist
          res.body.accessToken.should.have.lengthOf.above(10)
          done()
        })
    })
    it('should not login when no username is provided', (done) => {
      let login2 = {
        password: process.env.LOCAL_PASSWORD
      }
      chai.request(server)
        .post('/api/auth/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(login2)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Username not provided.')
          done()
        })
    })
    it('should not login when no password is provided', (done) => {
      let login3 = {
        username: process.env.LOCAL_USERNAME
      }
      chai.request(server)
        .post('/api/auth/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(login3)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Password not provided.')
          done()
        })
    })
    it('should not login when username is valid and password is not', (done) => {
      let login4 = {
        username: process.env.LOCAL_USERNAME,
        password: 'process.env.LOCAL_DATABASE'
      }
      chai.request(server)
        .post('/api/auth/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(login4)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.should.be.a('object')
          expect(res.body.accessToken).to.be.null
          res.body.message.should.equal("Authentication error - invalid username or password.")
          done()
        })
    })
  })
  describe('GET /api/meals', () => {
    it('should return a list of meals when a valid login token is provided', (done) => {
      let today = moment().format('MM/DD/YYYY')
      let targetDate = moment().add(35, 'd').format('MM/DD/YYYY')
      let middleDateNum = Math.floor(Math.random() * 33) + 1
      let midTargetDate = moment().add(middleDateNum, 'd').format('MM/DD/YYYY')
      chai.request(server)
        .get('/api/meals')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          expect(res.body).to.have.property(today)
          expect(res.body).to.have.property(targetDate)
          res.body[midTargetDate].breakfast.should.be.a('object')
          res.body[midTargetDate].lunch.should.be.a('object')
          res.body[midTargetDate].dinner.should.be.a('object')
          res.body[midTargetDate].snack.should.be.a('object')
          res.body[midTargetDate].holiday.should.be.a('string')
          done()
        })
    })
    it('should return an error message if no login token is provided', (done) => {
      chai.request(server)
        .get('/api/meals')
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Token not provided.')
          done()
        })
    })
    it('should return an error message if the login token is invalid', (done) => {
      chai.request(server)
        .get('/api/meals')
        .set('x-access-token', fakeToken)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Not authorized.')
          done()
        })
    })
  })
  describe('POST /api/meals', () => {
    it('should successfully schedule a meal with valid date, meal type, and description', (done) => {
      let token1 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal1 = {
        meal_date: moment().add(1, 'd').format('MM/DD/YYYY'),
        meal_desc: 'meal description'
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal1['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal1['meal_type'] = 'lunch'
          break
        case 2:
          newMeal1['meal_type'] = 'dinner'
          break
        case 3:
          newMeal1['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token1)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal1)
        .end((err, res) => {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Meal scheduled successfully!')
          done()
        })
    })
  })
  describe('PUT /api/meals', () => {

  })
  describe('DELETE /api/meals', () => {

  })
  describe('GET /api/users', () => {

  })
  describe('POST /api/users', () => {

  })
  describe('DELETE /api/users', () => {

  })
})