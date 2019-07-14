const express = require('express');
const router = express.Router();

const {
  getHomePage,
  registerUser,
  loggedIn,
  loggedOut,
  getProfile,
  updateProfile
} = require('../controllers/user.controller');

const {
  verifyLogin,
  verifyRegister,
  verifyAuth
} = require('../middlewares/user.middleware');
router.route('/')
  .get(getHomePage);
router.route('/register')
  .post(verifyRegister , registerUser);
router.route('/login')
  .post(verifyLogin, loggedIn);
router.route('/logout')
  .post(verifyAuth, loggedOut);
router.route('/profile/me')
  .get(verifyAuth, getProfile)
  .patch(verifyAuth, updateProfile)
// Error Handler User
router.use(function(err, req, res, next) {
  const { message, code } = err;
  if(!code) {
    return next(err);
  }
  res.status(code).send({message});
});
module.exports = router;
