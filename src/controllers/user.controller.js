const UserService = require('../services/user.service');

function getHomePage(req, res) {
  res.status(200).send({message : 'This Home Page'});
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const result = await UserService.createUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message : error.message })
  }  
}

async function loggedIn(req, res) {
  try {
    const { email, password } = req.body;
    const result = await UserService.loggedIn(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function loggedOut(req, res, next) {
  try {
    let user = req.user;
    const result = await UserService.loggedOut(user);
    res.status(200).send({message : 'Logged Out Success!'});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

function getProfile(req, res) {
  res.status(200).send(req.user);
}

async function updateProfile(req, res) {  
  try {
    const name = req.body.name, user = req.user;
    const result = await UserService.updateProfile(user, name);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

async function uploadAvatar(req, res) {
  try {
    const { path } = req.file, user = req.user;
    const user = await UserService.uploadAvatar(user, path);
    res.status(200).send({message : 'Upload avatar', user});
  } catch (error) {
    res.status(error.statusCode || 500).send({message : error.message})
  }
}

module.exports = {
  getHomePage,
  registerUser,
  loggedIn,
  loggedOut,
  getProfile,
  updateProfile,
  uploadAvatar
}
