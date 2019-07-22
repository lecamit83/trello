const UserModel = require('../models/user.model');
const { formatTitle } = require('../utils');

/**
 * @name createUser
 * 
 * @param { String } name 
 * @param { String } email 
 * @param { String } password 
 * 
 * @returns { Promise [Object] } 
 * 
 * 
 */

function createUser (name ,email, password) {
  return UserModel.create({name, email, password})
  .then(function (user) {
    return loggedIn(email, password);
  });
}

function loggedIn(email, password) {
  return UserModel.findByCredentials(email, password)
  .then(function(user) {
    return Promise.all([user, user.generateToken()]);
  })
  .then(function ([user, token]) {
    return Promise.all([user.save(), token]);
  })
  .then(function([user, token]){
    return { user, token };
  });
}

function loggedOut(user) {
  user.tokens = [];
  return user.save();
}

function updateProfile(user, name) {
  if(!name) {
    return Promise.reject({statusCode : 400, message : 'Name Invalid'});
  }
  user.name = formatTitle(name);
  return user.save();
}

module.exports = {
  createUser,
  loggedIn,
  loggedOut,
  updateProfile
}
