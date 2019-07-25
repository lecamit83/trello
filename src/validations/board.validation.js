const validator = require('validator');
const { formatTitle } = require('../utils');


function validateTitle(title) {
  let errors = [];
  if(validator.isEmpty(title)) {
    errors.push('Title is Empty!');
  }
  return errors;
}


function validateBoard(obj) {
  let board = {
    title : '',
    members : [],
    description : ''
  };
  board.title = formatTitle(obj.title);
  board.description = obj.description;
  let errors = [];
  errors.push(...validateTitle(board.title));
  
  let isValid = errors.length === 0;
  return {
    errors,
    isValid,
    board   
  };
}
module.exports = {
  validateBoard,
  formatTitle,
}
