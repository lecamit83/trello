const validator = require('validator');

/**
 * @name validateEmail
 * @description 
 *  check Email is valided?
 *  
 * 
 * @param {String} email 
 * 
 * @returns { [Object] } errors
 */
function validateEmail(email) {
  let errors = [];
  if(validator.isEmpty(email)) {
    errors.push('Email is required');
  } else if(!validator.isEmail(email)) {
    errors.push('Email invalid');
  }
  return errors;
}

/**
 * @name validatePassword
 * @description 
 *  check Password is valided?
 *  
 * 
 * @param {String} password 
 * 
 * @returns { [Object] } errors
 */

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

/**
 * @name validateName
 * @description 
 *  check Name is valided?
 *  
 * 
 * @param {String} name 
 * 
 * @returns { [Object] } errors
 */
function validateName(name) {
  let errors = [];

  if(validator.isEmpty(name)) {
    errors.push('Name is required');
  }
  return errors;
}

/**
 * @name validateRegister
 * 
 * @param {Object} data = {name , email, password}
 * @returns {Object} 
 *  contain errors, isValid and data
 */

function validateRegister(data) {
  data.email = data.email.trim().toLowerCase();
  data.name = data.name.trim().replace(/\s+/, ' ');
  
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
 * @name validateLogin
 * 
 * @param {Object} data = {email, password}
 * @returns {Object} 
 *  contain errors, isValid and data
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
