const multer = require('multer')
const jimp = require('jimp')
const db = require('../models/index.js')
const imageHelper = require('../middleware/fileValidation')
const path = require('path')
const fs = require('fs')
const User = db.User

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads')
  },

  filename: function(req, file, cb) {
    cb(null, `${req.username}${path.extname(file.originalname).toLowerCase()}`)
  }
})

module.exports = {

  getUser: (req, res) => {
    User.findOne({
      where: {
        username: req.username
      }
    }).then(user => {
      if (fs.existsSync(`./public/uploads/live/${req.username}.png`)) {
        return res.status(200).send({
          username: user.username,
          email: user.email,
          birthday: user.birthday,
          found: true
        })
      } else {
        return res.status(200).send({
          username: user.username,
          email: user.email,
          birthday: user.birthday,
          found: false
        })
      }
      }).catch(err => {
      res.status(200).send({
        message: "This user does not exist.",
        found: false
      })
    })
  },

  uploadImage: (req, res) => {
    let upload = multer({
      storage: storage,
      fileFilter: imageHelper.imageFilter
    }).single('file')

    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send({
          message: req.fileValidationError
        })
      } else if (err instanceof multer.MulterError) {
        return res.status(500).send({
          messsage: err
        })
      } else if (err) {
        return res.status(500).send({
          message: err
        })
      }
      if (!req.file) {
        return res.status(400).send({
          message: 'No file was uploaded.'
        })
      }
      //detect file extension
      const filetype = req.file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)[0]
      //resize image to 250 x 250
      jimp.read(`./public/uploads/${req.username}${filetype}`)
          .then(image => {
            image
              .resize(250, 250)
              .write(`./public/uploads/live/${req.username}.png`, () => {
                console.log(`${req.username}.png saved successfully.`)
              })
          })
          .then(() => {
            fs.unlink(`./public/uploads/${req.username}${filetype}`, function(err) {
              if (err) {
                console.log(`Temporary file ${req.username}${filetype} could not be deleted.`)
              } else {
                console.log(`Temporary file ${req.username}${filetype} deleted.`)
              }
              return res.status(200).send({
                message: 'Image successfully uploaded!'
              })
            })
          }).catch(err => {
            return res.status(500).send({
              message: err
            })
          })
    })
  },

  deleteImage: (req, res) => {
    fs.unlink(`./public/uploads/live/${req.username}.png`, function(err) {
      if (err && err.code === 'ENOENT') {
        return res.status(404).send({
          message: 'Profile picture does not exist, could not be deleted.'
        })
      } else if (err) {
        return res.status(500).send({
          message: 'Error occurred when trying to delete profile picture.'
        })
      } else {
        return res.status(200).send({
          message: 'Successfully deleted previous profile picture.'
        })
      }
    })
  }


}
