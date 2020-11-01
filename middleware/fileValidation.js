module.exports = {
  imageFilter: (req, file, cb) => {
    //console.log(file)
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files (jpg/jpeg, png, gif) are allowed for upload.'
      return cb(new Error(req.fileValidationError), false)
    }
    cb(null, true)
  }
}
