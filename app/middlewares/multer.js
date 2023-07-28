const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 99999999) + '-' + file.originalname);
  },
})

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format' }, false);
  }
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
  //   cb(null, true);
  // } else {
  //   cb({ message: 'Unsupported file format' }, false);
  // }
}

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 300000,
  },
  fileFilter: fileFilter,
})

module.exports = uploadMiddleware;