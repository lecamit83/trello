const UserService = require('../services/user.service');

function getHomePage(req, res) {
  res.status(200).send({message : 'This Home Page'});
}

function registerUser(req, res) {
  const { name, email, password } = req.body;
  UserService.createUser(name, email, password)
  .then(result => res.status(201).json(result))
  .catch(error => res.status(statusCode).send({ message : error.message }));
}

function loggedIn(req, res) {
  const { email, password } = req.body;
  UserService.loggedIn(email, password)
  .then(result => res.status(200).json(result))
  .catch(error => res.status(error.statusCode).send({message : error.message}));
}

function loggedOut(req, res, next) {
  let user = req.user;
  UserService.loggedOut(user)
  .then(user => res.status(200).send({message : 'Logged Out Success!'}))
  .catch(error => next(error));
}

function getProfile(req, res) {
  res.status(200).send(req.user);
}

function updateProfile(req, res) {  
  let name = req.body.name;
  let user = req.user;

  UserService.updateProfile(user, name)
  .then(function(user) {
    return res.status(200).send(user);
  })
  .catch(function(error) {
    return res.status(error.statusCode).send({message : error.message});
  });
}

module.exports = {
  getHomePage,
  registerUser,
  loggedIn,
  loggedOut,
  getProfile,
  updateProfile
}
