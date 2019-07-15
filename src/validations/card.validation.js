const validator = require('validator');
const { formatTitle } = require('../utils');

function validateTitle(title) {
  let errors = [];
  if(validator.isEmpty(title)) {
    errors.push('Title is Empty!');
  }
  return errors;
}

function validate(obj) {
  let card = {
    title : '',
  };
  card.title = formatTitle(obj.title);
  let errors = [];
  errors.push(...validateTitle(card.title));
  
  let isValid = errors.length === 0;
  return {
    errors,
    isValid,
    card   
  };
}

module.exports = {
  validate,
}
