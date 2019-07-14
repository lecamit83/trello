const User = require('../models/user.model');
const JWT  = require('jsonwebtoken');
const { 
  validateLogin,
  validateRegister,
} = require('../validations/user.validation');

async function verifyLogin(req, res, next) {
  const { errors, isValid, data } = validateLogin(req.body);
  if( !isValid ) {
    return res.status(400).send({errors});
  }
  try {
    const { user, error } = await User.findByCredentials(data.email, data.password);
    if(Object.keys(error).length !== 0) {
      return res.status(error.code).send({message : error.message});
    }  
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
}

async function verifyRegister(req, res, next) {
  const { errors, isValid, data } = validateRegister(req.body); 
  if( !isValid ) {
    return res.status(400).send({errors});
  }
  try {
    // Check exist email
    const result = await User.findOne({ email : data['email'] });
    if(result) {
      return res.status(400).send({message : 'Email was exist!'});
    }
    req.body = data;
    next();
  } catch(error) {
    return next(error);
  }
}

async function verifyAuth(req, res, next) {
  try {
    let token = req.headers['authorization'].replace('Bearer ', ''); 
    let decoded = JWT.verify(token, process.env.SECRET_KEY_JWT);   
    const user = await User.findOne({_id : decoded._id, 'tokens.token' : token});
    if(!user) {
      return res.status(404).send({errors : 'User Not Found!'});
    }
    req.user = user;  
    req.token = token;
    next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  verifyLogin,
  verifyRegister,
  verifyAuth
}
