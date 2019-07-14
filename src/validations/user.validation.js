const validator = require('validator');

function validateEmail(email) {
  let errors = [];
  if(validator.isEmpty(email)) {
    errors.push('Email is required');
  } else if(!validator.isEmail(email)) {
    errors.push('Email invalid');
  }
  return errors;
}

function validatePassword(password) {
  let errors = [];
  if(validator.isEmpty(password)) {
    errors.push('Password is required');
  } else {
    if(password.includes(' ')) {
      errors.push('Password cannot contains \'space\'');
    }else if(!validator.isLength(password, {min : 6,max : 30})) {
      errors.push('Password\'s length limit 6 to 30');
    }
  }
  return errors;
}
function validateName(name) {
  let errors = [];

  if(validator.isEmpty(name)) {
    errors.push('Name is required');
  }
  return errors;
}

/**
 * 
 * @param {name, email, password} obj
 * @returns {errors, isMatch, obj} 
 */
function validateRegister(data) {
  data.email = data.email.trim().toLowerCase();
  data.name = data.name.trim().replace(/\s/, ' ');
  
  const { name , email, password } = data;

  let errors = [];
  errors.push(...validateName(name));
  errors.push(...validateEmail(email));
  errors.push(...validatePassword(password));
  let isValid = errors.length === 0;
  return {
    errors,
    isValid,
    data   
  };
}

/**
 * 
 * @param {email, password} obj
 * @returns {errors, isMatch, obj} 
 */
function validateLogin(data) {
  data.email = data.email.trim().toLowerCase();
  const { email, password } = data;

  let errors = [];
  errors.push(...validateEmail(email));
  errors.push(...validatePassword(password));

  let isValid = errors.length === 0;
  return {
    errors,
    isValid,
    data
  };
}
module.exports = {
  validateRegister,
  validateLogin
};
