process.env.NODE_ENV = 'test'

let jwt = require('jsonwebtoken')
let auth = require('../config/auth')
let moment = require('moment')
let fs = require('fs')
const TESTFILEUPLOAD = './public/uploads/default/test1.png'
const TESTFILEUPLOADUNSUPPORTED = './public/uploads/default/test1.tiff'

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
    it('should fail to schedule a meal without a date', (done) => {
      let token2 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal2 = {
        meal_desc: 'meal description'
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal2['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal2['meal_type'] = 'lunch'
          break
        case 2:
          newMeal2['meal_type'] = 'dinner'
          break
        case 3:
          newMeal2['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token2)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal2)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('No meal date provided.')
          done()
        })
    })
    it('should fail to schedule a meal without a type', (done) => {
      let token3 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal3 = {
        meal_date: moment().add(1, 'd').format('MM/DD/YYYY'),
        meal_desc: 'meal description'
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token3)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal3)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('No meal type provided (breakfast, lunch, dinner, or snack).')
          done()
        })
    })
    it('should fail to schedule a meal without a description', (done) => {
      let token4 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal4 = {
        meal_date: moment().add(1, 'd').format('MM/DD/YYYY'),
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal4['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal4['meal_type'] = 'lunch'
          break
        case 2:
          newMeal4['meal_type'] = 'dinner'
          break
        case 3:
          newMeal4['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token4)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal4)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('No meal description provided.')
          done()
        })
    })
    it('should fail to schedule a meal with an invalid date', (done) => {
      let token5 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal5 = {
        meal_date: moment().add(1, 'd').format('MMMM Do, YYYY'),
        meal_desc: 'meal description'
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal5['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal5['meal_type'] = 'lunch'
          break
        case 2:
          newMeal5['meal_type'] = 'dinner'
          break
        case 3:
          newMeal5['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token5)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal5)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Invalid date format provided (use MM/DD/YYYY).')
          done()
        })
    })
    it('should fail to schedule a meal with a blank meal description', (done) => {
      let token6 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal6 = {
        meal_date: moment().add(2, 'd').format('MM/DD/YYYY'),
        meal_desc: ''
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal6['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal6['meal_type'] = 'lunch'
          break
        case 2:
          newMeal6['meal_type'] = 'dinner'
          break
        case 3:
          newMeal6['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token6)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal6)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('No meal description provided.')
          done()
        })
    })
    it('should fail to schedule a meal too far into the future', (done) => {
      let token7 = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      let newMeal7 = {
        meal_date: moment().add(76, 'd').format('MM/DD/YYYY'),
        meal_desc: 'test_description'
      }
      switch(Math.floor(Math.random() * 4 )) {
        case 0:
          newMeal7['meal_type'] = 'breakfast'
          break
        case 1:
          newMeal7['meal_type'] = 'lunch'
          break
        case 2:
          newMeal7['meal_type'] = 'dinner'
          break
        case 3:
          newMeal7['meal_type'] = 'snack'
          break
      }
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', token7)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newMeal7)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Specified date is too far into the future (>75 days from now).')
          done()
        })
    })
  })
  describe('PUT /api/meals', () => {
    var putToken = jwt.sign({
      username: process.env.LOCAL_USERNAME
    }, auth.secret, {
      expiresIn: 43200
    })
    var putType = Math.floor(Math.random() * 4 )
    var putMeal = {
      meal_date: moment().add(1, 'd').format('MM/DD/YYYY'),
      meal_desc: 'test description',
      meal_type: putType === 0 ? putType === 1 ? putType === 2 ? 'breakfast' : 'lunch' : 'dinner' : 'snack'
    }
    beforeEach((done) => {
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', putToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(putMeal)
        .end((err, res) => {
          done()
        })
    })
    afterEach((done) => {
      chai.request(server)
        .delete('/api/meals')
        .set('x-access-token', putToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(putMeal)
        .end((err, res) => {
          done()
        })
    })
    it('should successfully update an existing meal when all fields are provided', (done) => {
      let put1 = {
        meal_date: putMeal.meal_date,
        meal_type: putMeal.meal_type,
        meal_desc: 'modified'
      }
      chai.request(server)
        .put('/api/meals')
        .set('x-access-token', putToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(put1)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Meal details updated successfully!')
          done()
        })
    })
    it('should fail to update if the meal does not already exist', (done) => {
      let newDate = moment().add(1, 'w').format('MM/DD/YYYY')
      let put2 = {
        meal_date: newDate,
        meal_type: putMeal.meal_type,
        meal_desc: 'modified'
      }
      chai.request(server)
        .put('/api/meals')
        .set('x-access-token', putToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(put2)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal(`Could not update as no ${putMeal.meal_type} currently exists for ${newDate}.`)
          done()
        })
    })
  })
  describe('DELETE /api/meals', () => {
    var delToken = jwt.sign({
      username: process.env.LOCAL_USERNAME
    }, auth.secret, {
      expiresIn: 43200
    })
    var delType = Math.floor(Math.random() * 4 )
    var delMeal = {
      meal_date: moment().add(1, 'd').format('MM/DD/YYYY'),
      meal_desc: 'test description',
      meal_type: delType === 0 ? delType === 1 ? delType === 2 ? 'breakfast' : 'lunch' : 'dinner' : 'snack'
    }
    before((done) => {
      chai.request(server)
        .post('/api/meals')
        .set('x-access-token', delToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(delMeal)
        .end((err, res) => {
          done()
        })
    })
    it('should successfully delete an existing meal when all fields are provided', (done) => {
      chai.request(server)
        .delete('/api/meals')
        .set('x-access-token', delToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(delMeal)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Meal successfully deleted.')
          done()
        })
    })
    it('should fail to delete the meal if it does not already exist', (done) => {
      chai.request(server)
        .delete('/api/meals')
        .set('x-access-token', delToken)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(delMeal)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal(`This meal does not exist so was not deleted.`)
          done()
        })
    })

  })
  describe('GET /api/users', () => {
    it('should return the profile details for an existing user', (done) => {
      var userToken = jwt.sign({
        username: process.env.LOCAL_USERNAME
      }, auth.secret, {
        expiresIn: 43200
      })
      chai.request(server)
        .get('/api/users')
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.username.should.equal(process.env.LOCAL_USERNAME)
          res.body.email.should.equal(process.env.LOCAL_EMAIL)
          res.body.birthday.should.equal(process.env.LOCAL_BIRTHDAY)
          res.body.found.should.be.false
          done()
        })
    })
    it('should return an error message if the specified user does not exist', (done) => {
      var userToken = jwt.sign({
        username: 'process.env.LOCAL_USERNAME'
      }, auth.secret, {
        expiresIn: 43200
      })
      chai.request(server)
        .get('/api/users')
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('This user does not exist.')
          res.body.found.should.be.false
          done()
        })
    })
  })
  describe('POST /api/users', () => {
    var userToken = jwt.sign({
      username: process.env.LOCAL_USERNAME
    }, auth.secret, {
      expiresIn: 43200
    })
    it('should upload an image if it is a supported file format', (done) => {
      chai.request(server)
        .post('/api/users')
        .set('x-access-token', userToken)
        .attach('file', fs.readFileSync(TESTFILEUPLOAD), 'test1.png' )
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Image successfully uploaded!')
          done()
        })
    })
    it('should fail to upload an image if it is not a supported file format', (done) => {
      chai.request(server)
        .post('/api/users')
        .set('x-access-token', userToken)
        .attach('file', fs.readFileSync(TESTFILEUPLOADUNSUPPORTED), 'test1.tiff' )
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Only image files (jpg/jpeg, png, gif) are allowed for upload.')
          done()
        })
    })
    it('should return an error if no file is attached', (done) => {
      chai.request(server)
        .post('/api/users')
        .set('x-access-token', userToken)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('No file was uploaded.')
          done()
        })
    })
    after((done) => {
      fs.unlink(`./public/uploads/live/${process.env.LOCAL_USERNAME}.png`, (err) => {
        done()
      })
    })
  })
  describe('DELETE /api/users', () => {
    var delUserToken = jwt.sign({
      username: process.env.LOCAL_USERNAME
    }, auth.secret, {
      expiresIn: 43200
    })
    before((done) => {
      chai.request(server)
        .post('/api/users')
        .set('x-access-token', delUserToken)
        .attach('file', fs.readFileSync(TESTFILEUPLOAD), 'test1.png' )
        .end((err, res) => {
          done()
        })
    })
    it('when the avatar exists, it should be deleted', (done) => {
      chai.request(server)
        .delete('/api/users')
        .set('x-access-token', delUserToken)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Successfully deleted previous profile picture.')
          done()
        })
    })
    it('when the avatar does not exist, it should not be deleted', (done) => {
      chai.request(server)
        .delete('/api/users')
        .set('x-access-token', delUserToken)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.message.should.equal('Profile picture does not exist, could not be deleted.')
          done()
        })
    })

  })
})
