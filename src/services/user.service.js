const UserModel = require('../models/user.model');
const { formatTitle, isEmpty } = require('../utils');
const NotFound = require('../errors/NotFoundError');
const APIError = require('../errors/APIError');
/**
 * @name createUser
 * 
 * @param { String } name 
 * @param { String } email 
 * @param { String } password 
 * 
 * @returns { Promise [Object] } 
 * 
 */

async function createUser (name ,email, password) {
  const user = await UserModel.create({name, email, password});
  const token = await user.generateToken();
  await user.save();
  return {user, token};
}

/**
 * @name loggedIn
 * 
 * @param { String } name 
 * @param { String } email 
 * @param { String } password 
 * 
 * @returns { Promise [Object] } user = {user , token}
 * 
 */
async function loggedIn(email, password) {
  const user = await UserModel.findByCredentials(email, password);
  const token = await user.generateToken();
  await user.save();
  
  return {user, token};
}
/**
 * @name loggedOut
 * 
 * @param { Object } user 
 * 
 * @returns { Promise [Object] } user 
 * 
 */
function loggedOut(user) {
  // delete tokens in user
  user.tokens = [];
  return user.save();
}
/**
 * @name updateProfile
 * 
 * @param { Object } user 
 * @param { String } name
 * @returns { Promise [Object] } user 
 * 
 */
async function updateProfile(user, name) {
  // check name falsy
  if(!name) {
    throw new APIError('Name Invalid', 400);
  }
  // update name of User
  user.name = formatTitle(name);
  await user.save();

  return user;
}

async function uploadAvatar(user, path) {
  if(isEmpty(path)) {
    throw new APIError('Image Invalid', 400);
  }
  user.avatar = path;
  await user.save();

  return user;
}

module.exports = {
  createUser,
  loggedIn,
  loggedOut,
  updateProfile,
  uploadAvatar
}
