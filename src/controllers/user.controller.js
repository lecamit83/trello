const User = require('../models/user.model');
const { formatTitle } = require('../utils');
function getHomePage(req, res) {
  res.status(200).send({message : 'This Home Page'});
}

async function registerUser(req, res, next) {
  let user = new User(req.body);

  try {
    let token = await user.generateToken();
    await user.save();
    res.status(201).send({user, token});
  } catch (error) {
    return next(error);
  }
  
}

async function loggedIn(req, res) {

  try {
    let user = req.user;
    let token = await user.generateToken();
   
    await user.save();
    res.status(200).send({user, token});

  } catch (errors) {
    // return next(errors);
    res.status(404).send(errors);
  }
}

async function loggedOut(req, res, next) {
  try {
    let user = req.user;
    user.tokens = [];
    await user.save();

    res.status(200).send({message : 'Logout Success!'});
  } catch (error) {
    return next(error);
  }
}

function getProfile(req, res) {
  res.status(200).send(req.user);
}

async function updateProfile(req, res) {
  try {
    let name = formatTitle(req.body.name);
    let user = req.user;
    user.name = name;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getHomePage,
  registerUser,
  loggedIn,
  loggedOut,
  getProfile,
  updateProfile
}
