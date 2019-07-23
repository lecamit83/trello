const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename : function (req, file, cb) {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // resolve a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    //reject file
    cb(null, false);
  }
};

const upload = multer({ 
  storage,  
  fileFilter : fileFilter,
  limits : {
    fileSize : 1024 * 1024 * 3,
  }
});
const {
  getHomePage,
  registerUser,
  loggedIn,
  loggedOut,
  getProfile,
  updateProfile,
  uploadAvatar,
} = require('../controllers/user.controller');

const {
  verifyLogin,
  verifyRegister,
  isAuth
} = require('../middlewares/user.middleware');
router.route('/')
  .get(getHomePage);
router.route('/users/register')
  .post(verifyRegister , registerUser);
router.route('/users/login')
  .post(verifyLogin, loggedIn);
router.route('/users/logout')
  .post(isAuth, loggedOut);
router.route('/users/profile/me')
  .get(isAuth, getProfile)
  .patch(isAuth, updateProfile)
router.route('/users/profile/me/avatar')
  .put(isAuth, upload.single('avatar'), uploadAvatar);

// Error Handler User
router.use(function(err, req, res, next) {
  const { message, code } = err;
  if(!code) {
    return next(err);
  }
  res.status(code).send({message});
});
module.exports = router;
